const Category = require("../../models/Category");
const Company = require("../../models/Company");
const QueryFeatures = require("../../util/QueryFeatures");
const tryCatch = require("../../util/tryCatch");

exports.index = tryCatch(async (req, res, next) => {
  const categories = await Category.findAll();
  res.status(200).send({ status: true, result: { categories } });
});

exports.getCategoryCompanies = tryCatch(async (req, res, next) => {
  const { category_id } = req.params;
  const qf = new QueryFeatures(req);
  const { data: companies, responseMetaData } = await qf.findAllWithFeatures(
    Company,
    {
      category_id,
    }
  );
  // const companies = await Company.findAll({ where: {  } });
  const category = await Category.findByPk(category_id);
  res
    .status(200)
    .send({ status: true, result: { companies, category, responseMetaData } });
});
