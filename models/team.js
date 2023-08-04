const { DataTypes } = require('sequelize');
const sequelize = require('../DB/db');
const bcrypt = require('bcrypt');

const Team = sequelize.define("Team", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accessLevel: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: async (team) => {
            const salt = await bcrypt.genSalt();
            team.password = await bcrypt.hash(team.password, salt);
            console.log('Password has been hashed successfully');
        }
    }
});

module.exports = Team;
