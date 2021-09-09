const db = require("../models");
const Employee = db.employees;

// Create and Save a new Employee
exports.create = (req, res) => {
   // Validate request
   if (!req.body.first_name && !req.body.last_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create an Employee
  const employee = new Employee({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    telephone: req.body.telephone,
    email: req.body.email,
    dni: req.body.dni,
    address: req.body.address   
  });

  // Save Employee in the database
  employee
    .save(employee)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the employee."
      });
    });
};

// Retrieve all employees from the database.
exports.findAll = (req, res) => {
    const last_name = req.query.last_name;
    var condition = last_name ? { last_name: { $regex: new RegExp(last_name), $options: "i" } } : {};
  
    Employee.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving employees."
        });
      });
  };

// Find a single employee with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Employee.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found employee with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving employee with id=" + id });
      });
  };

// Update an employee by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update employee with id=${id}. Maybe employee was not found!`
          });
        } else res.send({ message: "employee was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating employee with id=" + id
        });
      });
  };

// Delete an employee with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Employee.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete employee with id=${id}. Maybe employee was not found!`
          });
        } else {
          res.send({
            message: "employee was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete employee with id=" + id
        });
      });
  };

// Delete all employees from the database.
exports.deleteAll = (req, res) => {
  Employee.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Employees were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all employees."
        });
      });
  };