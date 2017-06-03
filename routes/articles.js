/* jshint esversion: 6 */

const express = require('express');
const router = express.Router();

// Bring in Models
let Article = require('../models/article');

// 'Add Article' Route
router.get('/add', function (req, res) {
    res.render('add-article', {
        title: 'Add Article'
    });
});

// 'Add Submit POST' Route
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Content is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add-article', {
            title: 'Add Article',
            errors: errors
        });
    } else {

        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Artícle Added');
                res.redirect('/');
            }
        });
    }
});

// Edit Form Route
router.get('/edit/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('edit-article', {
            title: 'Edit Article',
            article: article
        });
    });
});

// 'Edit Submit POST' Route
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    };

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

// Delete Article
router.delete('/:id', function (req, res) {
    let query = {
        _id: req.params.id
    };

    Article.remove(query, function (err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

// Get Single Article Route
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        res.render('article', {
            article: article
        });
    });
});

module.exports = router;