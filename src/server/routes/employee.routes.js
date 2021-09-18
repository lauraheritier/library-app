module.exports = app => {
    const employees = require("../controllers/employee.controller.js");
  
    var router = require("express").Router();
  
    // Create a new employee
    router.post("/", employees.create);
  
    // Retrieve all employees
    router.get("/", employees.findAll);
  
    // Retrieve a single employee with id
    router.get("/:id", employees.findOne);
  
    // Update an employee with id
    router.put("/:id", employees.update);

    router.put("/:id/:isActive", employees.updateIsActive);
  
    // Delete a employee with id
    router.delete("/:id", employees.delete);
  
    // Delete all employees
    router.delete("/", employees.deleteAll);
  
    app.use('/api/employees', router);
  };