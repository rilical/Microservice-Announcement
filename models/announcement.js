const { DataTypes } = require('sequelize');
const sequelize = require('../DB/db')

const Announcement = sequelize.define("Announcement", {
    announcement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    announcement_title : {
        type: DataTypes.STRING,
        allowNull: false
    },
    announcement_body: {
        type: DataTypes.STRING
    },
    record_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => Date.now()
    },
    publish_date: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => Date.now()
    },
    expire_date: {
        type: DataTypes.DATE,
    },
    pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      platform_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });

module.exports = Announcement;
