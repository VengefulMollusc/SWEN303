var express = require('express');
var router = express.Router();
var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get("/", function(req, res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	" (//name[@type='place'])[1]",
	function (error, result){
		if (error){console.error(error);}
		else {
			res.render('index', {title: 'Colenso Project', place: result.result});
		}
	});
});

router.get('/search', function(req, res) {
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " +
	req.query.searchString, 
	function (error, result){
		if (error){console.error(error);}
		else {
			var results = result.result;
			var resultArray = [];
			var last = 0;
			for (var i = 0, len = results.length; i < len; i++){
				if (results[i] == "/"){
					if (results.substring(i+1, i+5) == "TEI>"){
						var singleResult = results.substring(last, i+5);
						resultArray.push(singleResult);
						last = i+5;
					}
				}
			}
			if (resultArray.length < 1){
				resultArray.push(results);
			}
			res.render('search', { title: 'Colenso XQuery Search Results', content: req.query.searchString, 
			searchResult: result.result, results: resultArray});
		}
	});
});

router.get('/textsearch', function(req, res) {
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0'; " +
	"ft:mark(db:open('Colenso')[. contains text '" + 
	req.query.textSearchString
	+"'])", 
	function (error, result){
		if (error){console.error(error);}
		else {
			var results = result.result;
			var resultArray = [];
			var last = 0;
			for (var i = 0, len = results.length; i < len; i++){
				if (results[i] == "/"){
					if (results.substring(i+1, i+5) == "TEI>"){
						var singleResult = results.substring(last, i+5);
						resultArray.push(singleResult);
						last = i+5;
					}
				}
			}
			if (resultArray.length < 1){
				resultArray.push(results);
			}
			if (req.query.textSearchString == null){
				res.render('textsearch', { title: 'Colenso Text Search Results', content: req.query.textSearchString, 
				searchResult: "", results: ""});
			} else {
				res.render('textsearch', { title: 'Colenso Text Search Results', content: req.query.textSearchString, 
				searchResult: result.result, results: resultArray});
			}
		}
	});
});


module.exports = router;
