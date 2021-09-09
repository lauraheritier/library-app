module.exports = app => {
    const authors = require("../controllers/author.controller.js");
  
    var router = require("express").Router();
  
    // Create a new author
    router.post("/", authors.create);
  
    // Retrieve all authors
    router.get("/", authors.findAll);
  
    // Retrieve a single author with id
    router.get("/:id", authors.findOne);
  
    // Update an author with id
    router.put("/:id", authors.update);
  
    // Delete an author with id
    router.delete("/:id", authors.delete);
  
    // Delete all authors
    router.delete("/", authors.deleteAll);
  
    app.use('/api/authors', router);
  };