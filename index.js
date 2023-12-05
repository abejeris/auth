const express = require('express');
const app = express();
const User = require('./models/user');
const port = 3000;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

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
app.use(session({ secret: 'not a good secret' }));

const requireLogin = (req, res, next) => {
	if (!req.session.user_id) {
		return res.redirect('/login');
	}
	next();
};

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
	req.session.user_id = user._id;
	res.redirect('/');
});

app.get('/login', (req, res) => {
	res.render('login');
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const validPassword = await bcrypt.compare(password, user.password);
	if (validPassword) {
		req.session.user_id = user._id;
		res.redirect('/secret');
	} else {
		res.redirect('/login');
	}
});

app.post('/logout', (req, res) => {
	// req.session.user_id = null; can be used to delete info about user or destroy all saved info in the session
	req.session.destroy();
	res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
	res.render('secret');
});

app.get('/topsecret', requireLogin, (req, res) => {
	res.send('top secret');
});

app.listen(port, () => {
	console.log(`app running on port ${port}`);
});
