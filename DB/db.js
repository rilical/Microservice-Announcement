const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, 
                                process.env.DB_PASSWORD, {
                                    host: process.env.DB_HOST,
                                    dialect: 'mysql',
                                    port: process.env.DB_PORT,
                                    logging: console.log // Add this line for logging
                                });

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully');
        } catch (err) {
        console.error('Unable to connect to the database', err)
        }
            }
                                
connectDB();
                                
module.exports = sequelize;
