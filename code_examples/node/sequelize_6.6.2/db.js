const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

sequelize.sync();

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  email: { 
    type: DataTypes.STRING,
    validate: {
      isEmail: {
        args: { allow_display_name: true }
      }
    }
  }
});

module.exports = User;