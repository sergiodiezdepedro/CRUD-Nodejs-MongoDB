/* jshint esversion: 6 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function (req, res) {
    res.render('register');
});

// Register Process
router.post('/register', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('name', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El E-mail es obligatorio').notEmpty();
    req.checkBody('email', 'El E-mail no es válido').isEmail();
    req.checkBody('username', 'El nombre de usuario es obligatorio').notEmpty();
    req.checkBody('password', 'La contraseña es obligatoria').notEmpty();
    req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newUser.password, salt, function (er, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        req.flash('success', 'Ya estás registrado y ahora puedes acceder');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});

//Login Form
router.get('/login', function (req, res) {
    res.render('login');
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Estás desconectado');
    res.redirect('/users/login');
});

module.exports = router;