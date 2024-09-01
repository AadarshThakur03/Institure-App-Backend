// /database/Migration.js

import dbConfig from "../config/dbconfig.js";

class Migration {
  constructor(database) {
    this.database = database;
  }

  async createDatabaseAndTables() {
    try {
      await this.database.query(
        `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
      );
      console.log(`Database ${dbConfig.database} created or already exists.`);

      await this.database.query(`USE ${dbConfig.database}`);
      await this.createStudentsTable();
      await this.createAdminTable();
      await this.createInstituteTable();
    } catch (error) {
      console.error("Error creating database or tables:", error);
      throw error;
    }
  }

  async createStudentsTable() {
    const createStudentsTable = `
            CREATE TABLE IF NOT EXISTS students_tables (
              student_id INT NOT NULL AUTO_INCREMENT,
              student_email VARCHAR(254) NOT NULL UNIQUE,
              student_name VARCHAR(255) NOT NULL,
              institute_id INT,
              PRIMARY KEY (student_id)
            );
        `;
    await this.database.query(createStudentsTable);
    console.log("Students table created or already exists.");
  }

  async createAdminTable() {
    const createAdminTable = `
            CREATE TABLE IF NOT EXISTS Administrator (
              admin_id MEDIUMINT NOT NULL AUTO_INCREMENT,
              email VARCHAR(255) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              PRIMARY KEY (admin_id)
            );
        `;
    await this.database.query(createAdminTable);
    console.log("Administrator table created or already exists.");
  }

  async createInstituteTable() {
    const createInstituteTable = `
            CREATE TABLE IF NOT EXISTS institute_table (
                institute_id INT NOT NULL AUTO_INCREMENT,
                institute_name VARCHAR(255) NOT NULL,
                institute_password VARCHAR(255) NOT NULL,
                admin_id MEDIUMINT,
                PRIMARY KEY (institute_id)
            );

        `;
    await this.database.query(createInstituteTable);
    console.log("Institue table created or already exists.");
  }
}

export default Migration;
