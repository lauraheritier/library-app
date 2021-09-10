const db = require("../models");
const Category = db.categories;

// Create and Save a new Category
exports.create = (req, res) => {
   // Validate request
   if (!req.body.description) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Create a Category
  const category = new Category({
    description: req.body.description    
  });

  // Save Category in the database
  category
    .save(category)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the category."
      });
    });
};

// Retrieve all Categories from the database.
exports.findAll = (req, res) => {
    const description = req.query.escription;
    var condition = description ? { description: { $regex: new RegExp(description), $options: "i" } } : {};
  
    Category.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving categories."
        });
      });
  };

// Find a single Category with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Category.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found category with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Category with id=" + id });
      });
  };

// Update a category by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update category with id=${id}. Maybe category was not found!`
          });
        } else res.send({ message: "category was updated successfully." });
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating category with id=" + id
        });
      });
  };

// Delete a category with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Category.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete category with id=${id}. Maybe category was not found!`
          });
        } else {
          res.send({
            message: "category was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete category with id=" + id
        });
      });
  };

// Delete all categories from the database.
exports.deleteAll = (req, res) => {
  Category.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} Categories were deleted successfully!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all categories."
        });
      });
  };