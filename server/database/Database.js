const { Sequelize } = require("sequelize");
const mysql = require("mysql2");
const database = require("../config/databaseConfig");

class Database {
  #connection = null;
  #connectionSetting = null;
  #db = null;
  #testing = false;
  constructor(testing = false, db = database.default) {
    this.#db = db;
    this.#testing = testing;
    return this;
  }

  connect() {
    this.#connectionSetting =
      database.connections[this.#testing ? `${this.#db}-testing` : this.#db];
    this.#connection = new Sequelize(process.env.DB_URL,{
      dialect:process.env.DB_DIALECT,
      database:process.env.DB_NAME
    });
    (async () => {
      try {
        await this.#connection.authenticate();
        console.log("✅ Connection has been established successfully.");
      } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
      }
    })();
    return this.#connection;
  }

  async #createDB() {
    if (this.#db == "mysql") {
      const {
        username: user,
        password,
        host,
        port,
        database: databaseName,
      } = database.connections[
        this.#testing ? `${this.#db}-testing` : this.#db
      ];
      let connection = mysql
        .createPool(process.env.DB_URL,{
          database:process.env.DB_NAME
        })
        .promise();
      try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        await this.migrate();
        connection.end();
        connection = null;
      } catch (error) {
        throw error;
      }
    }
  }

  async migrate() {
    try {
      // await this.#connection.sync({ force: false });
    } catch (error) {
      if (error.original?.errno == 1049) {
        // database not found
        await this.#createDB();
      } else {
        throw error;
      }
    }
  }

  async drop() {
    await this.#connection.query(
      `DROP DATABASE IF EXISTS ${this.#connectionSetting.database}`
    );
  }
}

module.exports = Database;
