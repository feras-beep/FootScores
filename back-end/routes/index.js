var express = require('express');
var request = require('request');
var http = require('http');
var router = express.Router();
var fixtures = require('../api/football-api');
var database = require('../database/mongo');
var auth = require('../auth/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FootScores' });
});

/* Authenticate with a JWT */
router.get('/auth', auth.authenticate);

/* GET any leagues matches */
router.get('/fixtures/:id', function(req, res, next) {
  var matches = fixtures.getMatchesByCompetition(req.params.id, function(data) {
    res.render('matches', {matches: data});
  });
});

/* GET matches from db */
router.get('/matches', function(req, res, next) {
  database.getConnection(fixtures.serveMatches);
  res.render('matches', {matches: {}});
});

/* GET matches of a certain league from db */
router.get('/matches/:id', function(req, res, next) {
  var id = req.params.id;
  database.getConnection(function(db, callback) {
    console.log('Matches in competition ' + id);
    fixtures.serveMatchesCompetition(db, id, callback);
  });
  res.render('matches', {matches: {}});
});


module.exports = router;