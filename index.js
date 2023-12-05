const express = require('express');
const app = express();
const User = require('./models/user');
port = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/register', (req, res) => {
	res.render('register');
});

app.get('/secret', (req, res) => {
	res.send('this is secret');
});
app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
