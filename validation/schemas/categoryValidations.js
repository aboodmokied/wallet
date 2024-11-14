const { body } = require("express-validator");
const Category = require("../../models/Category");

exports.createCategoryValidation=[
    body('name').notEmpty().withMessage('Category Name Required').custom(async(name)=>{
        const count=await Category.count({where:{name}});
        if(count){
            return Promise.reject('This Category Already Exist');
        }
        
    })
]