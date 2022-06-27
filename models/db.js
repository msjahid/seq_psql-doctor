const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize('postgres://postgres:5271@127.0.0.1:5432/urls'); // Example for postgres

sequelize.authenticate().then( () => {
    console.log('Connection has been established successfully.');
}).catch ((error) =>  {
    console.error('Unable to connect to the database:', error);
});

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Must be unique'
        },
        validate: {
            isEmail: {args: true, msg: 'Enter a valid Email! Try again.'}
        },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: { args: [8,9000], msg: 'Password is too short!' }
        },
    }

});
//
// sequelize.sync().then( e => {
//   console.log("database synced");
// }).catch(e => {
//   console.err("Database sync failed");
// })

User.beforeCreate(async (user) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hashSync(user.password, salt);
});

//static method to login user
User.login = async function(email, password) {
    const user = await this.findOne({ where: {email} });
    if (!user) {
        throw Error('incorrect email!');
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        throw Error('incorrect password!');
    }

    return user;
}

module.exports = { User };