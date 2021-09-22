const db = require("../models");
const Book = db.books;
const Borrowing = db.borrowings;
const Member= db.members;

// Create and Save a new Book
exports.create = (req, res) => {
  // Validate request
  if (!req.body.book) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Book
  const borrowing = new Borrowing({
    member: req.body.member,
    book: req.body.book,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    cancelled: req.body.cancelled
  });


  // Save Book in the database
  borrowing
    .save(borrowing)
    .then(data => {
      res.send(data);
      console.log("préstamo guardadoooooo");
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the book."
      });
      console.log("el book ", borrowing);
    });
};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
  var condition = {cancelled: false};

  Borrowing
    .find()
    .collation({ locale: 'en', strength: 2 })
    .sort({ cancelled: 1 })   
    .populate("member", "first_name last_name membership_id", Member)
    .populate("book", "title", Book)
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
exports.giveBack = (req, res) => {
  const id = req.params.id;
  console.log("pasó x el if correcto de give back");
    Borrowing.findById(id, function (err, docs) {
      docs.cancelled = true;
      docs.save();
      console.log("el préstamo está cancelado? ", docs.cancelled);
    });
}

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Borrowing.findById(id)
  .populate("member", 'first_name last_name membership_id', Member)
  .populate("book", 'title', Book)
    .then(data => {
      console.log("la dataa del borrowing", data);
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

  Borrowing.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

  Borrowing.findByIdAndRemove(id)
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
  Borrowing.deleteMany({})
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
  Borrowing.find({ cancelled: true })
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