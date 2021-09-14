module.exports = app => {
    const books = require("../controllers/book.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Book
    router.post("/", books.create);
  
    // Retrieve all Books
    router.get("/", books.findAll);
  
    // Retrieve all books that cannot be borrowed
    router.get("/libraryOnly", books.findAllLibraryOnly);
  
    // Retrieve a single Book with id
    router.get("/:id", books.findOne);
  
    // Update a book with id
    router.put("/:id", books.update);
  
    // Delete a book with id
    router.delete("/:id", books.delete);
  
    // Delete all books
    router.delete("/", books.deleteAll);
  
    app.use('/api/books', router);
  };