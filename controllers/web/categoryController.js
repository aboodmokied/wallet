const Category = require("../../models/Category");
const Company = require("../../models/Company");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");

exports.index=tryCatch(async(req,res,next)=>{
    const features=new QueryFeatures(req);
    const {data:categories,responseMetaData}=await features.findAllWithFeatures(Category);
    req.session.pagePath=req.url;
    return res.render('wallet/category/index',{
        pageTitle:'Categories',
        categories,
        responseMetaData
    });
});

exports.create=(req,res,next)=>{
    req.session.pagePath=req.url;
    res.render('wallet/category/create',{
        pageTitle:'Create Category'
    });   
};
exports.store=tryCatch(async(req,res,next)=>{
    const {name}=req.body;
    await Category.create({name});
    res.redirect('/category');
});


exports.categoryCompanies=tryCatch(async(req,res,next)=>{
    const {category_id}=req.params;
    const category=await Category.findByPk(category_id);
    const features=new QueryFeatures(req);
    const {data:companies,responseMetaData}=await features.findAllWithFeatures(Company,{
        category_id:category.id
    });
    res.render('wallet/wallet-user/users',{
        pageTitle:`Category "${category.name}" Companies`,
        users:companies,
        responseMetaData,
        guard:'company'
    });
});     