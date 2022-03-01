module.exports = app => {
    const borrowing = require("../controllers/borrowing.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Book
    router.post("/", borrowing.create);
  
    // Retrieve all Books
    router.get("/", borrowing.findAll);
  
    // Retrieve all books that cannot be borrowed
    router.get("/cancelled", borrowing.findAllReadBooks);
  
    // Retrieve a single Book with id
    router.get("/:id", borrowing.findOne);

    //Retrieve filtered books
    router.get("/:publisher", borrowing.findByFilter);
  
    // Update a book with id
    router.put("/:id", borrowing.update);

    //Give book back
    router.put("/:id/:cancelled", borrowing.giveBack);


  
    // Delete a book with id
    router.delete("/:id", borrowing.delete);
  
    // Delete all books
    router.delete("/", borrowing.deleteAll);
  
    app.use('/api/borrowings', router);
  };