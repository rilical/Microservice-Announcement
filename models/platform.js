const { DataTypes } = require('sequelize');
const sequelize = require('../DB/db')

const Platform = sequelize.define('Platform', {
        platform_id :  {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        platform_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        platform_description: {
            type: DataTypes.STRING,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue : true
        },
        cors_domains: {
            type: DataTypes.STRING,
            defaultValue : null
        }
    }, {
        freezeTableName: true,
        timestamps: false,
});

module.exports = Platform;



