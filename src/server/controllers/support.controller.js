const db = require("../models");
const Support = db.supports;

// Create and Save a new Support
exports.create = (req, res) => {
   // Validate request
   if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a support
  const support = new Support({
    description: req.body.description,
    isActive: true    
  });

  // Save Support in the database
  support
    .save(support)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the support."
      });
    });
};

// Retrieve all supports from the database.
exports.findAll = (req, res) => {
    var condition = {isActive: true}

    Support.find(condition)
    .collation({ locale: 'en', strength: 2 }).sort({ description: 1 })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving supports."
        });
      });
  };

// Find a single Support with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Support.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found support with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Support with id=" + id });
      });
  };

  exports.updateIsActive = (req, res) => {
    var id = req.params.id;
    //Set status inactive (delete)
    console.log("pasó x el if correcto");
    Support.findById(id, function (err, docs) {
      docs.isActive = false;
      docs.save();
    });
    return;
  }

// Update a support by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Support.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update Support with id=${id}. Maybe Support was not found!`
          });
        } else res.send({ message: "Support was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Support with id=" + id
        });
      });
  };

// Delete a support with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Support.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete support with id=${id}. Maybe support was not found!`
          });
        } else {
          res.send({
            message: "Support was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete support with id=" + id
        });
      });
  };

// Delete all supports from the database.
exports.deleteAll = (req, res) => {
  Support.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Supports were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all supports."
        });
      });
  };