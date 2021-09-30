const db = require("../models");
const Employee = db.employees;

// Create and Save a new Employee
exports.create = (req, res) => {
    // Validate request
    if (!req.body.first_name && !req.body.last_name) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    Employee.findOne({ dni: req.body.dni }).select("dni").lean().then(result => {
        if (result && req.body.dni !== '') {
            console.log("existe el employee!", req.body.dni, "existe ");
            res.status(400).send({ message: "no puede haber duplicados" });
            return;
        } else {

            // Create an Employee
            const employee = new Employee({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                telephone: req.body.telephone,
                email: req.body.email,
                dni: req.body.dni,
                address: req.body.address,
                isActive: true
            });

            // Save Employee in the database
            employee
                .save(employee)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the employee."
                    });
                });
        }

    });
}

// Retrieve all employees from the database.
exports.findAll = (req, res) => {
    var condition = { isActive: true };

    Employee.find(condition)
        .collation({ locale: 'en', strength: 2 }).sort({ first_name: 1, last_name: 1 })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving employees."
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

exports.updateIsActive = (req, res) => {
    let result;
    var id = req.params.id;
    //Set status inactive (delete)
    console.log("pasó x el if correcto");
    Employee.findById(id, function(err, docs) {
        docs.isActive = false;
        docs.save()
            .then(data => {
                result = true;
                res.send(result);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while retrieving books."
                });
            });
    });
    return;
}

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
                message: err.message || "Some error occurred while removing all employees."
            });
        });
};