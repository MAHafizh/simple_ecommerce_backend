import { Sequelize } from "sequelize";

const db = new Sequelize('simple_ecommerce', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;