const { DataTypes } = require('sequelize');
const sequelize = require('../DB/db')

const Domains = sequelize.define('Domains', {
    domain_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    domain_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    platform_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  });

module.exports = Domains

