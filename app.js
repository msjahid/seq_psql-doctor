const express = require('express');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser');
//set up express app
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

//initialize route
app.use(authRoutes);
app.use('', require('./routes/index'));


app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port: ${process.env.PORT || 3000}`);
})