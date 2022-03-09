const db = require("../models");
const url = require('url');
var Promise = require("bluebird");
const randomNumber = require("random-number-csprng");
const Book = db.books;
const author = db.authors;
const Publisher = db.publishers;
const Category = db.categories;
const Support = db.supports;
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("7179d710ff32d9d26df46b14314ff3e6d99e8d0e143a1f23ace4719d07136083");

exports.quote = (req, res) => {
    console.log("los parámetros:", req.params.author, req.params.title, req.params.isbn);
    const parameters = {
        engine: "google_scholar",
        q: `author:${req.params.author}` 
        
      };
      const callback = function(data) {
       var result = data.organic_results.filter((book) => {
(book.title.toLowerCase()).includes((`${req.params.title}`).toLowerCase());
        });
        console.log(`${req.params.title}`, " result ", result);
      };
      search.json(parameters, callback);
}