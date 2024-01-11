const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const encrypt = require("mongoose-encryption");
require("dotenv").config();


const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const secret = process.env.SECRET;

mongoose.connect("mongodb+srv://admin:<password>@cluster0.dtzfcae.mongodb.net/weatherAppDB"); //change username and password with mongodb atlas username and password

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.get("/login.html", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});

app.post("/signupform", function (req, res) {
    const userName = _.lowerCase(_.trimEnd(_.trimStart(req.body.userName)));
    const userEmail = _.lowerCase(_.trimEnd(_.trimStart(req.body.userEmail)));
    const userPhone = _.lowerCase(_.trimEnd(_.trimStart(req.body.userPhone)));
    const userCity = _.lowerCase(_.trimEnd(_.trimStart(req.body.userCity)));
    const userCountry = _.lowerCase(_.trimEnd(_.trimStart(req.body.userCountry)));
    const userPassword = req.body.userPassword;

    const newUser = new User({
        name: userName,
        email: userEmail,
        phone: userPhone,
        city: userCity,
        country: userCountry,
        password: userPassword
    });

    User.findOne({ email: userEmail }).then(function (foundUser) {
        if (!foundUser) {
            newUser.save();
            res.sendFile(__dirname + "/login.html")
        }
        else {
            const errorMessage = "User Already exists."
            res.render('signup', { errorMessage: errorMessage });
        }
    }).catch(function (err) {
        console.log(err);
    });
});


//logging and authenticating user
app.post("/login", function (req, res) {
    const userEmail = _.lowerCase(_.trimEnd(_.trimStart(req.body.userEmail)));
    const userPassword = req.body.userPassword;

    User.findOne({ email: userEmail }).then(function (foundUser) {
        if (!foundUser) {
            console.log("user Not found");
        }
        else {
            if (foundUser.password === userPassword) {
                res.sendFile(__dirname + "/userProfileUpdate.html");
                console.log("logged in with city : " + foundUser.city);
            }
            else {
                console.log("incorrect password");
            }
        }
    }).catch(function (err) {
        console.log(err);
    });
});

//updating user info

app.post("/updateUserDetails", async function (req, res) {
    try {
        const userEmail = _.lowerCase(_.trimEnd(_.trimStart(req.body.userEmail)));
        const userName = _.lowerCase(_.trimEnd(_.trimStart(req.body.userName)));
        const userPhone = _.lowerCase(_.trimEnd(_.trimStart(req.body.userPhone)));
        const userCity = _.lowerCase(_.trimEnd(_.trimStart(req.body.userCity)));
        const userCountry = _.lowerCase(_.trimEnd(_.trimStart(req.body.userCountry)));
        const userPassword = _.lowerCase(_.trimEnd(_.trimStart(req.body.userPassword)));
        const newUserEmail = _.lowerCase(_.trimEnd(_.trimStart(req.body.newUserEmail)));

        // Step 1: Update name, phone, city, country
        const fieldsToUpdate1 = {};
        if (userName.length !== 0) fieldsToUpdate1.name = userName;
        if (userPhone.length !== 0) fieldsToUpdate1.phone = userPhone;
        if (userCity.length !== 0) fieldsToUpdate1.city = userCity;
        if (userCountry.length !== 0) fieldsToUpdate1.country = userCountry;
        await User.updateOne({ email: userEmail }, { $set: fieldsToUpdate1 });

        // Step 2: Update password and email (if provided)
        if (userPassword.length !== 0 || newUserEmail.length !== 0) {
            const fieldsToUpdate2 = {};
            if (userPassword.length !== 0) {
                const encryptedPassword = await encrypt.encrypt(userPassword);
                fieldsToUpdate2.password = encryptedPassword;
            }
            if (newUserEmail.length !== 0) {
                fieldsToUpdate2.email = newUserEmail;
            }
            await User.updateOne({ email: userEmail }, { $set: fieldsToUpdate2 });
        }

        res.status(200).send("Profile updated successfully");
    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).send("Error updating profile");
    }
});


app.listen(3000, function () {
    console.log("Server running on port: 3000.");
});