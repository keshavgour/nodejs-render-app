const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 80;

dotenv.config();

mongoose.connect(process.env.DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{console.log("DB is connected")})
    .catch(err => console.error('Could not connect to mongodb', err))

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Create Model for the Schema
const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/signup', (req, res) => {
    res.send(`
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f0f0;
    }

    form {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    input, button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1em;
    }

    button {
        background-color: #007bff;
        color: #ffffff;
        border: none;
    }

    button:hover {
        background-color: #0056b3;
    }
    </style>

    <form action="/signup" method="post">
        <input id="username" type="text" name="username" placeholder="Username">
        <input id="password" type="password" name="password" placeholder="Password">
        <button id="submit" type="submit">Register</button>
        </form>
    `);
   
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);

    if(!username) {
        return res.send('<div id="error-message">Username is required</div>');
    }
    if (!password) {
        return res.send('<div id="error-message">Password is required</div>');
    }

    const user = new User({
        username,
        password
    });

    try{
        await user.save();
    }catch(err){
        console.error(err);
        return res.send('<div id="error-message">Something went wrong, please try later</div>');
    }

    return res.send('<div id="success-message">User signed up successfully</div>');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});