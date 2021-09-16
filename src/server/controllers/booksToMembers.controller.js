const db = require("../models");
const Book = db.books;
const author = db.authors;
const Publisher = db.publishers;
const Category = db.categories;
const Support = db.supports;
const BooksToMembers = db.booksToMembers;
const Member= db.members;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Book
  const booksToMembers = new BooksToMembers({
    member: req.body.member,
    book: req.body.book,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    availableSamples: req.body.availableSamples,
    cancelled: req.body.cancelled ? req.body.cancelled : false
  });

  // Save Book in the database
  booksToMembers
    .save(booksToMembers)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the book."
      });
      console.log("el book ", booksToMembers);
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
   //var condition = member ? { member: member } : {};

  BooksToMembers
    .find()
    .populate("member", 'first_name', 'last_name', Member)
    .populate("book", 'title', Book)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  BooksToMembers.findById(id)
  .populate("member", 'first_name', 'last_name', member)
  .populate("book", 'title', Book)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found book with id " + id });
      else res.send(data);

    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Book with id=" + id });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  BooksToMembers.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update book with id=${id}. Maybe book was not found!`
        });
      } else res.send({ message: "book was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating book with id=" + id
      });
    });
};

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  BooksToMembers.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete book with id=${id}. Maybe book was not found!`
        });
      } else {
        res.send({
          message: "book was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete book with id=" + id
      });
    });
};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
  BooksToMembers.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Books were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all books."
      });
    });
};

// Find all Books that cannot be borrowed
exports.findAllLibraryOnly = (req, res) => {
  BooksToMembers.find({ cancelled: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    });
};

exports.findByFilter = (req, res) => {
//  const filters = req.params.filterName;
  const filtersValue = req.params.filterValue;
  console.log("los filters", filters);
  BooksToMembers.find({book: filtersValue})
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving books."
    });
  });
}