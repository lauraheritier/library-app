const db = require("../models");
const Member = db.members;

// Create and Save a new member
exports.create = (req, res) => {
   // Validate request
   if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  
  // Create a member
  const member = new Member({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    telephone: req.body.telephone,
    email: req.body.email,
    dni: req.body.dni,
    address: req.body.address,
    membership_id: req.body.membership_id
  });

  // Save member in the database
  member
    .save(member)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the member."
      });
    });
};

// Retrieve all members from the database.
exports.findAll = (req, res) => {
    const last_name = req.query.last_name;
    var condition = last_name ? { last_name: { $regex: new RegExp(last_name), $options: "i" } } : {};
  
    Member.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving members."
        });
      });
  };

// Find a single member with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Member.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found member with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving member with id=" + id });
      });
  };

// Update a member by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Member.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update member with id=${id}. Maybe member was not found!`
          });
        } else res.send({ message: "member was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating member with id=" + id
        });
      });
  };

// Delete a member with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Member.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete member with id=${id}. Maybe member was not found!`
          });
        } else {
          res.send({
            message: "member was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete member with id=" + id
        });
      });
  };

// Delete all members from the database.
exports.deleteAll = (req, res) => {
  Member.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Members were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all members."
        });
      });
  };