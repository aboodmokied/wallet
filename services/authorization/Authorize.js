const { Op, where } = require("sequelize");
const Permission = require("../../models/Permission");
const Role = require("../../models/Role");
const RoleHasPermission = require("../../models/RoleHasPermission");
const UserHasRole = require("../../models/UserHasRole");
const authConfig = require("../../config/authConfig");
const BadRequestError = require("../../Errors/ErrorTypes/BadRequestError");
const Application = require("../../Application");
const bcrypt=require('bcryptjs');
const Admin = require("../../models/Admin");

class Authorize{
    #permissions=new Set();
    constructor(){
        return Authorize.instance??=this;
    }
    
    get permissions(){
        return this.#permissions;
    }

    addPermission(permission){
        this.#permissions.add(permission);
    }

    async setup(){
        this.#defineRelations();
        await this.#definePermissions();
        await this.#defineRoles();
        this.#defineRoleAggregations();
        await this.#defineSuperAdmin();
    }
    #defineRelations(){
        // role - permission
        Role.belongsToMany(Permission,{
            through:RoleHasPermission,
            foreignKey:'roleId',
            otherKey:'permissionId'
        })

        Permission.belongsToMany(Role,{
            through:RoleHasPermission,
            foreignKey:'permissionId',
            otherKey:'roleId'
        })

        Role.hasMany(UserHasRole,{
            foreignKey:'roleId',
            // onDelete:'SET-NULL'
        });
        UserHasRole.belongsTo(Role,{
            foreignKey:'roleId'
        })
    }
    applyAuthorization(model){
        model.belongsToMany(Role,{
            through:UserHasRole,
            foreignKey:'userId',
            otherKey:'roleId'
        })
        
        Role.belongsToMany(model,{
            through:UserHasRole,
            foreignKey:'roleId',
            otherKey:'userId'
        })

        this.#permissionAggregationFunctions(model);
        this.#roleAggregationFunctions(model);
    }
    
    #roleAggregationFunctions(model){
        // Before: validate role existence
        // Class Level
            model.hasRole=async function(userId){
                const user=await model.findByPk(userId);
                const count=await Role.count({
                    include:{model:UserHasRole,where:{userId,guard:user.guard},required:true}
                })
                return count?true:false;
            }

            model.assignRole=async function(role,userId){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not assignable')
                const user=await model.findByPk(userId);
                const count=await UserHasRole.count({where:{userId,guard:user.guard,roleId:roleInstance.id}});
                if(count){
                    throw new Error(`${role.name} already assigned to this user`)
                }
                const result=await UserHasRole.create({userId,guard:user.guard,roleId:roleInstance.id});    
                return result;
            }
            model.revokeRole=async function(role,userId){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not revokable')
                // const count=await UserHasRole.count({where:{userId,roleId:roleInstance.id}});
                // if(count){
                //     throw new Error(`${role.name} already assigned to this user`)
                // }
                const user=await model.findByPk(userId);
                const result=await UserHasRole.destroy({where:{userId,guard:user.guard,roleId:roleInstance.id}});    
                return result;
            }
            model.getRoles=async function(role,userId){
                const user=await model.findByPk(userId);
                const roles=await Role.findAll({
                    where:{[Op.or]:[{name:role},{id:role}]},
                    include:{model:UserHasRole,where:{userId,guard:user.guard},required:true}
                })
                return roles;
            }
            model.getAvaliableRoles=async function(userId){
                const user=await model.findByPk(userId);
                const roles=await Role.findAll({
                    where:{
                        id:{[Op.notIn]:Application.connection.literal(`(SELECT roleId FROM user_has_roles WHERE userId=${userId} AND guard='${user.guard}')`)},
                        isMain:false
                    },

                })
                return roles;
            }

        // Instance Level
            model.prototype.hasRole=async function(role){
                const count=await Role.count({
                    where:{name:role},
                    include:{model:UserHasRole,where:{userId:this.id,guard:this.guard},required:true}
                })
                return count?true:false;
            }
            model.prototype.assignRole=async function(role){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not assignable')
                const count=await UserHasRole.count({where:{userId:this.id,guard:this.guard,roleId:roleInstance.id}});
                if(count){
                    throw new Error(`${role.name} already assigned to this user`)
                }
                const result=await UserHasRole.create({userId:this.id,guard:this.guard,roleId:roleInstance.id});    
                return result;
            }

            model.prototype.revokeRole=async function(role){
                const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
                if(roleInstance.isMain)throw new BadRequestError('Main Roles is not revokable')
                // const count=await UserHasRole.count({where:{userId,roleId:roleInstance.id}});
                // if(count){
                //     throw new Error(`${role.name} already assigned to this user`)
                // }
                const result=await UserHasRole.destroy({where:{userId:this.id,guard:this.guard,roleId:roleInstance.id}});    
                return result;
            }
            model.prototype.getRoles=async function(){
                
                const roles=await Role.findAll({
                    include:{model:UserHasRole,where:{userId:this.id,guard:this.guard},required:true}
                })
                return roles;
            }
            model.prototype.getAvaliableRoles=async function(){
                const roles=await Role.findAll({
                    where:{
                        id:{[Op.notIn]:await Application.connection.literal(`(SELECT roleId FROM user_has_roles WHERE userId=${this.id} AND guard='${this.guard}')`)},
                        isMain:false
                    },
                    })
                return roles;
            }
    }
    #permissionAggregationFunctions(model){
        // Class Level
        model.getPermissionsViaRoles=async function(userId){ // ***
            // let userPermissions=[];
            // const userRoles=await Role.findAll({include:[{model:model,through:UserHasRole,where:{id:userId},required:true},{model:Permission}]})
            // for(let role of userRoles){
            //     userPermissions=[...userPermissions,role.permissions];
            // }
            // const permissions=new Set(userPermissions);
            // // return permissions;
            const user=await model.findByPk(userId);
            const permissions=await Permission.findAll({
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:userId,guard:user.guard},required:true}
                    }
                
            })
            return permissions;
        } 
        model.hasPermissionViaRoles=async function(userId,permission){ // ***
            const user=await model.findByPk(userId);
            const permissionInstance=await Permission.findOne({
                where:{[Op.or]:[{name:permission},{id:permission}]},
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:userId,guard:user.guard},required:true}
                    }
                
            })
            return permissionInstance?true:false;
        } 

        // Instance Level 
        model.prototype.getPermissionsViaRoles=async function(){ // ***
            const permissions=await Permission.findAll({
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:this.id,guard:this.guard},required:true}
                    }
                
            })
            return permissions;
        } 
        model.prototype.hasPermissionViaRoles=async function(permission){ // ***
            console.log({model:model,guard:this.guard})
            const permissionInstance=await Permission.findOne({
                where:{[Op.or]:[{name:permission},{id:permission}]},
                include:{
                    model:Role,
                    through:RoleHasPermission,
                    required:true,
                    include:{model:model,through:UserHasRole,where:{id:this.id,guard:this.guard},required:true}
                    }
            })
            console.log({permissionInstance,roles:permissionInstance.roles,role:permissionInstance.roles[0]});
            return permissionInstance?true:false;
        } 
    }

    async applySystemRoles(user){
        const {guard}=user;
        const roles=[];
        const guardRole=authConfig.guards[guard].role.name;
        const commonRole=authConfig.commonRole.name;
        roles.push(commonRole);
        roles.push(guardRole);
        for(let role of roles){
            const roleInstance=await Role.findOne({where:{name:role}});
            await UserHasRole.create({userId:user.id,roleId:roleInstance.id,guard:guard});
        }
    }
    // #superAdminAggregationFunctions(model){
    //     model.isSuperAdmin=async function(userId){
    //         const user=await model.findByPk(userId);
    //         if(user.guard=='admin',)
    //     }
    // }    
    async #definePermissions(){
        for(let per of this.#permissions){
                const count=await Permission.count({where:{name:per}})
                if(!count){
                    await Permission.create({name:per});
                }
            }
            
        }


    async #defineRoles(){
        let roles=Object.keys(authConfig.guards).map(guardName=>{
            const guardObj=authConfig.guards[guardName];
            return guardObj.role.name
        });
        roles=[authConfig.commonRole.name,...roles];
        for(let role of roles){
            const count=await Role.count({where:{name:role}})
            if(!count){
                await Role.create({name:role,isMain:true});
            }
        }
    }

    #defineRoleAggregations(){
        // BEFORE: role - permissions validations
        // class level
        Role.assignPermission=async function(role,permission){
            const permissionInstance=await Permission.findOne({where:{[Op.or]:[{name:permission},{id:permission}]}});
            const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
            const count=await RoleHasPermission.count({where:{roleId:roleInstance.id,permissionId:permissionInstance.id}});
            if(count)throw new BadRequestError();
            const result=await roleInstance.addPermission(permissionInstance);
            return result;
        }
        Role.revokePermission=async function(role,permission){
            const permissionInstance=await Permission.findOne({where:{[Op.or]:[{name:permission},{id:permission}]}});
            const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
            const result=await RoleHasPermission.destroy({where:{roleId:roleInstance.id,permissionId:permissionInstance.id}});
            return result;
        }
        Role.getAvailablePermissions=async function(role){
            const roleInstance=await Role.findOne({where:{[Op.or]:[{name:role},{id:role}]}});
            const permissions=await Permission.findAll({
                where:{id:{[Op.notIn]:Application.connection.literal(`(SELECT permissionId FROM role_has_permissions WHERE roleId=${roleInstance.id})`)}},
            })
            return permissions;
        }
        // instance level
        Role.prototype.assignPermission=async function(permission){
            const permissionInstance=await Permission.findOne({where:{[Op.or]:[{name:permission},{id:permission}]}});
            const count=await RoleHasPermission.count({where:{roleId:this.id,permissionId:permissionInstance.id}});
            if(count)throw new BadRequestError();
            const result=await this.addPermission(permissionInstance);
            return result;
        }
        Role.prototype.revokePermission=async function(role,permission){
            const permissionInstance=await Permission.findOne({where:{[Op.or]:[{name:permission},{id:permission}]}});
            const result=await RoleHasPermission.destroy({where:{roleId:this.id,permissionId:permissionInstance.id}});
            return result;
        }
        Role.prototype.getAvailablePermissions=async function(){
            const permissions=await Permission.findAll({
                where:{id:{[Op.notIn]:Application.connection.literal(`(SELECT permissionId FROM role_has_permissions WHERE roleId=${this.id})`)}},
            })
            return permissions;
        }
    }

    async #defineSuperAdmin(){
        const count=await Admin.count({where:{isSuper:true}});
        if(!count){
            const userAdmin=await Admin.create({
                        name:process.env.SUPER_ADMIN_NAME,
                        email:process.env.SUPER_ADMIN_EMAIL,
                        password:bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD,12),
                        verified:true,
                        isSuper:true
                    })
                    await this.applySystemRoles(userAdmin);
        }
        // const count=await SuperAdmin.count();
        // if(!count){
        //     const userAdmin=await Admin.create({
        //         name:process.env.SUPER_ADMIN_NAME,
        //         email:process.env.SUPER_ADMIN_EMAIL,
        //         password:bcrypt.hashSync(process.env.SUPER_ADMIN_PASSWORD,12),
        //         verified:true
        //     })
        //     await this.applySystemRoles(userAdmin);
        //     const superAdmin=await SuperAdmin.create({adminId:userAdmin.id});
        // }

    }




}

module.exports=Authorize;