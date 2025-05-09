const { Op } = require("sequelize");
const BadRequestError = require("../Errors/ErrorTypes/BadRequestError");

class QueryFeatures {
  queryOptions = {};
  responseMetaData = {};
  constructor(req) {
    this.queryStr = req.query;
  }

  // filtering
  filter(model) {
    // const excludedParmas=['limit','page','fields','sort'];
    const filteringProps = { ...this.queryStr };
    let modelAttr = Object.keys(model.rawAttributes);
    const blacklist = ["password", "id", "verified", "googleOAuth", "guard"];
    for (let queryAttr in filteringProps) {
      if (!modelAttr.includes(queryAttr) || blacklist.includes(queryAttr)) {
        delete filteringProps[queryAttr];
      }
    }
    // excludedParmas.forEach(ele=>{
    //     delete filteringProps[ele];
    // });
    if (Object.keys(filteringProps).length) {
      const parsedQuery = {};

      for (const [field, condition] of Object.entries(filteringProps)) {
        if (typeof filteringProps[field] == "object") {
          parsedQuery[field] = {};
          for (const [operator, value] of Object.entries(condition)) {
            let sequelizeOperator;

            switch (operator) {
              case "gte":
                sequelizeOperator = Op.gte;
                break;
              case "lte":
                sequelizeOperator = Op.lte;
                break;
              case "gt":
                sequelizeOperator = Op.gt;
                break;
              case "lt":
                sequelizeOperator = Op.lt;
                break;
              case "ne":
                sequelizeOperator = Op.ne;
                break;
              // Add more operators as needed
              default:
                throw new BadRequestError(`Unsupported operator: ${operator}`);
            }
            parsedQuery[field] = { [sequelizeOperator]: value };
          }
        } else {
          parsedQuery[field] = filteringProps[field];
        }
      }
      if (this.queryOptions.where) {
        this.queryOptions.where = {
          ...this.queryOptions.where,
          ...parsedQuery,
        };
      } else {
        this.queryOptions.where = parsedQuery;
      }
    }

    return this;
  }

  // sort
  sort() {
    /**
     * sort:'-price,age'
     * [['price','DESC'],['age','ASC']]
     * */
    if (this.queryStr.sort) {
      const sortingProps = this.queryStr.sort.split(",");
      const propsArr = [];
      sortingProps.forEach((prop) => {
        let ord = null;
        let filed = prop;
        if (prop.startsWith("-")) {
          ord = "DESC";
          filed = prop.substring(1);
        } else {
          ord = "ASC";
        }
        propsArr.push([filed, ord]);
      });
      this.queryOptions.order = propsArr;
    }
    return this;
  }

  // limiting fileds
  fields() {
    if (this.queryStr.fields) {
      let process = "include";
      let fieldsArr = this.queryStr.fields.split(",");
      if (fieldsArr[0].startsWith("-")) {
        process = "exclude";
      }
      let notAllowed = false;
      if (process == "exclude") {
        // each field should starts with -
        notAllowed = fieldsArr.some((field) => !field.startsWith("-"));
      } else {
        // each field should not starts with -
        notAllowed = fieldsArr.some((field) => field.startsWith("-"));
      }
      if (notAllowed) {
        throw new BadRequestError(
          "Proccess not allowed, all fields should be exclude or include"
        );
      }
      if (process == "exclude") {
        fieldsArr = fieldsArr.map((f) => f.substring(1));
        this.queryOptions.attributes = {};
        this.queryOptions.attributes[process] = fieldsArr;
      } else {
        this.queryOptions.attributes = fieldsArr;
      }
    }
    return this;
  }
  // pagination

  async paginate(model, whereOptions) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const offset = (page - 1) * limit;
    this.queryOptions.offset = offset;
    this.queryOptions.limit = limit;
    this.responseMetaData.currentPage = page;
    if (model) {
      const options = {};
      if (this.queryOptions.where) {
        options.where = this.queryOptions.where;
      }
      options.where = { ...options.where, ...whereOptions };
      const count = await model.count(options);
      this.responseMetaData.totalItems = count;
      this.responseMetaData.totalPages = Math.ceil(count / limit) || 1;
    }
    return this;
  }

  search(model) {
    if (this.queryStr.search) {
      let modelAttr = Object.keys(model.rawAttributes);
      const blacklist = [
        "password",
        "id",
        "verified",
        "googleOAuth",
        "guard",
        "updatedAt",
        "createdAt",
      ];
      modelAttr = modelAttr.filter((attr) => !blacklist.includes(attr));
      const orConditions = [];
      modelAttr.forEach((attr) => {
        orConditions.push({
          [attr]: { [Op.like]: `%${this.queryStr.search}%` },
        });
      });
      if (!this.queryOptions.where) {
        this.queryOptions.where = {};
      }
      this.queryOptions.where[Op.or] = orConditions;
    }
    return this;
  }

  async findAllWithFeatures(model, whereOptions = {}, otherOptions = {}) {
    await this.filter(model)
      .search(model)
      .fields()
      .sort()
      .paginate(model, whereOptions);
    const updatedQueryOptions = { ...this.queryOptions };
    updatedQueryOptions.where = {
      ...updatedQueryOptions.where,
      ...whereOptions,
    };

    const data = await model.findAll({
      ...updatedQueryOptions,
      ...otherOptions,
    });
    this.responseMetaData.length = data.length;
    const result = { data, responseMetaData: this.responseMetaData };
    return result;
  }
}

module.exports = QueryFeatures;
