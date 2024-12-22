const { body, param } = require("express-validator");
const Category = require("../../models/Category");

exports.validateCategoryName=body('name').notEmpty().withMessage('Category Name Required').custom(async(name)=>{
    const count=await Category.count({where:{name}});
    if(count){
        return Promise.reject('This Category Already Exist');
    }
    
})


exports.validateCategoryIsFound=param('category_id').custom(async(id)=>{
    const count=await Category.count({where:{id}});
    if(!count){
        return Promise.reject('No Category with this category_id');
    }
})