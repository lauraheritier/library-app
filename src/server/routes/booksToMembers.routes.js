module.exports = app => {
    const booksToMembers = require("../controllers/booksToMembers.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Book
    router.post("/", booksToMembers.create);
  
    // Retrieve all Books
    router.get("/", booksToMembers.findAll);
  
    // Retrieve all books that cannot be borrowed
    router.get("/cancelled", booksToMembers.findAllLibraryOnly);
  
    // Retrieve a single Book with id
    router.get("/:id", booksToMembers.findOne);

    //Retrieve filtered books
    router.get("/:publisher", booksToMembers.findByFilter);
  
    // Update a book with id
    router.put("/:id", booksToMembers.update);
  
    // Delete a book with id
    router.delete("/:id", booksToMembers.delete);
  
    // Delete all books
    router.delete("/", booksToMembers.deleteAll);
  
    app.use('/api/booksToMembers', router);
  };