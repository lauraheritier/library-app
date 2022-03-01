module.exports = app => {
    const books = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Book
    router.post("/", books.create);
  
    // Retrieve all Books
    router.get("/", books.findAll);
  
    // Retrieve all books that cannot be borrowed
    router.get("/ReadBooks", books.findAllReadBooks);
  
    // Retrieve a single Book with id
    router.get("/:id", books.findOne);

    //Retrieve filtered books
    router.get("/:publisher", books.findByFilter);
  
    
    // Update a book with id
    router.put("/:id", books.update);

    router.put("/:id/:availableResources/:returnBack", books.updateAvailableResources);
  
    
    // Delete all books
    router.delete("/", books.deleteAll);
  
    app.use('/api/books', router);
  };