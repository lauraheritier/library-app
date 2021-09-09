const db = require("../models");
const Author = db.authors;

// Create and Save a new Author
exports.create = (req, res) => {
   // Validate request
   if (!req.body.first_name && !req.body.last_name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create an Author
  const author = new Author({
    first_name: req.body.first_name,
    last_name: req.body.last_name    
  });

  // Save Author in the database
  author
    .save(author)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the author."
      });
    });
};

// Retrieve all authors from the database.
exports.findAll = (req, res) => {
    const last_name = req.query.last_name;
    var condition = last_name ? { last_name: { $regex: new RegExp(last_name), $options: "i" } } : {};
  
    Author.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving authors."
        });
      });
  };

// Find a single author with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Author.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found author with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving author with id=" + id });
      });
  };

// Update an author by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Author.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update author with id=${id}. Maybe author was not found!`
          });
        } else res.send({ message: "author was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating author with id=" + id
        });
      });
  };

// Delete an author with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Author.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete author with id=${id}. Maybe author was not found!`
          });
        } else {
          res.send({
            message: "author was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete author with id=" + id
        });
      });
  };

// Delete all authors from the database.
exports.deleteAll = (req, res) => {
    Author.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Authors were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all authors."
        });
      });
  };