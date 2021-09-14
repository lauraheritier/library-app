module.exports = app => {
    const supports = require("../controllers/support.controller.js");
  
    var router = require("express").Router();
  
    // Create a new support
    router.post("/", supports.create);
  
    // Retrieve all supports
    router.get("/", supports.findAll);
  
    // Retrieve a single support with id
    router.get("/:id", supports.findOne);
  
    // Update a support with id
    router.put("/:id", supports.update);
  
    // Delete a support with id
    router.delete("/:id", supports.delete);
  
    // Delete all supports
    router.delete("/", supports.deleteAll);
  
    app.use('/api/supports', router);
  };