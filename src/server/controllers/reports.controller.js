const db = require("../models");
const Book = db.books;
const Borrowing = db.borrowings;
const Member = db.members;
const Category = db.categories;
const Support = db.supports;
const Publisher = db.publishers;

/**
 * Look up data:
 * 1. Total resources most requested by month
 * 2. Total borrowings per member
 * 4. Most requested author
 * 5. Resources inventory alphabetically ordered
 * 6. Members inventory alphabetically ordered
 * 7. Employees inventory alphabetically ordered
 * 8. List of borrowings ordered by status (cancelled)
 */


//1. Total resources  by month

//2. Total borrowings per member
exports.borrowingsPerMember = (req, res) => {
  console.log("pasó x borrowings per member");
  Borrowing
  .aggregate([
    {
      $group: {
        _id: "$member",
        totalAmount: { $sum: "book" },
        count: { "$sum": 1 }
      }     
    }
  ])
  .then(data => {
      //console.log("datos de borrowing", data);      
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    });
}

// Retrieve all Books from the database.
exports.getAllFromReports = (req, res) => {
 Borrowing
    .find()
    .populate("book", 'author title', Book)
    .populate("member", 'first_name last_name membership_id', Member)
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

//3. Total amount of 'libraryOnly' resources
exports.libraryOnlyQuery = (req, res) => {
  Book.find({ libraryOnly: true }).collation({ locale: 'en', strength: 2 }).sort({ title: 1 })
    .populate("category", 'description', Category)
    .populate("publisher", 'description', Publisher)
    .populate("support", "description", Support)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    })
}

  //4. Most requested author

  //5. Resources inventory alphabetically ordered

  //6. Members inventory alphabetically ordered

  //7. Employees inventory alphabetically ordered

  //8. List of borrowings ordered by status (cancelled)