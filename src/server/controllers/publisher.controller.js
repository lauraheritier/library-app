const db = require("../models");
const Publisher = db.publishers;

// Create and Save a new publisher
exports.create = (req, res) => {
   // Validate request
   if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a publisher
  const publisher = new Publisher({
    description: req.body.description,
    url: req.body.url    
  });

  // Save publisher in the database
  publisher
    .save(publisher)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the publisher."
      });
    });
};

// Retrieve all publisher from the database.
exports.findAll = (req, res) => {
    const description = req.query.description;
    var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  
    Publisher.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving publishers."
        });
      });
  };

// Find a single publisher with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Publisher.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found publisher with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving publisher with id=" + id });
      });
  };

// Update a publisher by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Publisher.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update publisher with id=${id}. Maybe publisher was not found!`
          });
        } else res.send({ message: "publisher was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating publisher with id=" + id
        });
      });
  };

// Delete a publisher with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Publisher.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete publisher with id=${id}. Maybe publisher was not found!`
          });
        } else {
          res.send({
            message: "publisher was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete publisher with id=" + id
        });
      });
  };

// Delete all publishers from the database.
exports.deleteAll = (req, res) => {
    Publisher.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Publishers were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all publishers."
        });
      });
  };