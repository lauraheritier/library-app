const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.books = require("./book.model.js")(mongoose);
db.categories = require("./category.model.js")(mongoose);
db.publishers = require("./publisher.model")(mongoose);
db.employees = require("./employee.model.js")(mongoose);
db.members = require("./member.model.js")(mongoose);
db.supports = require("./support.model.js")(mongoose);
db.booksToMembers = require("./booksToMembers.model.js")(mongoose);

module.exports = db;