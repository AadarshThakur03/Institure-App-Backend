// /database/Database.js
import mysql from 'mysql2';
import dbConfig from '../config/dbconfig.js';

class Database {
    constructor() {
        if (!Database.instance) {
            this.connection = null;
            Database.instance = this;
        }
        return Database.instance;
    }

    initConnection() {
        if (!this.connection) {
            this.connection = mysql.createConnection({
                host: dbConfig.host,
                user: dbConfig.user,
                password: dbConfig.password,
                database: dbConfig.database // Initially put a comment over this line
            });

            this.connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to the MySQL server:', err.stack);
                    return;
                }
                console.log('Connected to the MySQL server as id ' + this.connection.threadId);
            });
        }
        return this.connection;
    }

    query(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    endConnection() {
        if (this.connection) {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error closing the connection:', err.stack);
                }
                console.log('Database connection closed.');
            });
        }
    }
}

const dbInstance = new Database();
// Object.freeze(dbInstance);
export default dbInstance;
