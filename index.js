const express = require('express');
const app = express();
const User = require('./models/user');
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose
	.connect('mongodb://127.0.0.1:27017/authDemo')
	.then(() => {
		console.log('Mongo connection open!');
	})
	.catch((err) => {
		console.log('its the error message, and it says:');
		console.log(err);
	});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send('this is the home page');
});
app.get('/register', (req, res) => {
	res.render('register');
});

app.post('/register', async (req, res) => {
	const { password, username } = req.body;
	const hash = await bcrypt.hash(password, 12);
	const user = new User({
		username,
		password: hash,
	});
	await user.save();
	res.redirect('/');
});

app.get('/secret', (req, res) => {
	res.send('this is secret');
});
app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
