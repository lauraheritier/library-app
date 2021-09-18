module.exports = app => {
    const publishers = require("../controllers/publisher.controller.js");
  
    var router = require("express").Router();
  
    // Create a new publisher
    router.post("/", publishers.create);
  
    // Retrieve all publishers
    router.get("/", publishers.findAll);
  
    // Retrieve a single publisher with id
    router.get("/:id", publishers.findOne);
  
    // Update a publisher with id
    router.put("/:id", publishers.update);

    router.put("/:id/:isActive", publishers.updateIsActive);
  
    // Delete a publisher with id
    router.delete("/:id", publishers.delete);
  
    // Delete all publishers
    router.delete("/", publishers.deleteAll);
  
    app.use('/api/publishers', router);
  };