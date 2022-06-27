const db = require('../models/db');
const jwt = require('jsonwebtoken');


//handel errors
const handleErrors = (err) => {
  // console.log(err.message, err.code)
  let errors = { email: '', password: '' };

  // validate errors
  if (err.message.includes('Validation error')){
    err.errors.map(error => {
      console.log(error.path, error.message);
      errors[error.path] = error.message;
    });
  }

  // email error
  if(err.message === 'incorrect email!') {
    errors.email = "Invalid Email";
  }

  //password error
  if(err.message === 'incorrect password!') {
    errors.password = "Invalid Password";
  }

  //duplicate key error
  if(err.message === 'Must be unique') {
    errors.email = "Email Already Exists!";
    return errors;
  }

  return errors;
};

// jwt token
const maxAge = 10 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secret key', {
    expiresIn: maxAge
  });
}

module.exports.signup_get = (req, res) => {
  res.render('pages/signup');
}

module.exports.login_get = (req, res) => {
  res.render('pages/login');
}

module.exports.signup_post = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await db.User.create({email, password});
    const token = createToken(user.id);
    res.cookie('SSID', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.status(201).json({ user: user.id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

// console.log(User.login('m@google.com', '12345678'));
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.login(email, password);
    const token = createToken(user.id);
    res.cookie('SSID', token, { httpOnly: true, maxAge: maxAge * 1000});
    res.status(200).json({ user: user.id });
  }catch (err){
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.logout_get = (req, res) => {
  res.cookie('SSID', '', { maxAge: 1 });
  res.redirect('/');
}