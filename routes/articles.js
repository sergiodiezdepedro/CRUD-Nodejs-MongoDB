/* jshint esversion: 6 */

const express = require('express');
const router = express.Router();

// Bring in Models
let Article = require('../models/article');
let User = require('../models/user');

// 'Add Article' Route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add-article', {
        title: 'Añadir Artículo'
    });
});

// 'Add Submit POST' Route
router.post('/add', function (req, res) {
    req.checkBody('title', 'El título es obligatorio').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'El contenido es obligatorio').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add-article', {
            title: 'Añadir Artículo',
            errors: errors
        });
    } else {

        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Artículo Añadido');
                res.redirect('/');
            }
        });
    }
});

// Edit Form Route
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            req.flash('danger', 'No Autorizado');
            res.redirect('/');
        }
        res.render('edit-article', {
            title: 'Editar Artículo',
            article: article
        });
    });
});

// 'Edit Submit POST' Route
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Artículo Actualizado');
            res.redirect('/');
        }
    });
});

// Delete Article
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    };

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {

            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// Get Single Article Route
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author, function (err, user) {

            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated) {
        return next();
    } else {
        req.flash('danger', 'Identifícate como Usuario, por favor');
        res.redirect('/users/login');
    }
}

module.exports = router;