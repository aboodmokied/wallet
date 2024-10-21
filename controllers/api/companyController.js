const Company = require("../../models/Company");
const tryCatch = require("../../util/tryCatch");

// exports.index = tryCatch(async (req, res, next) => {
//   const companies = await Company.findAll();
//   res.status(200).send({ status: true, result: { companies } });
// });


exports.show = tryCatch(async (req, res, next) => {
  const company = await Company.findByPk(req.params.company_id);
  res.status(200).send({ status: true, result: { company } });
});


