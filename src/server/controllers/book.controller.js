const db = require("../models");
var Promise = require("bluebird");
const randomNumber = require("random-number-csprng");
const Book = db.books;
const author = db.authors;
const Publisher = db.publishers;
const Category = db.categories;
const Support = db.supports;

// Create and Save a new Book
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    Book.findOne({ isbn: req.body.isbn }).select("isbn").lean().then(result => {
       
        if (result && req.body.isbn !== null && req.body.isbn !== '') {
            console.log("pasó x acá", req.body.isbn, "existe ");
            console.log("el isbn es un espacio trucho?", req.body.isbn);
            res.status(400).send({ message: "no puede haber duplicados" });
            return;
        } else {
            let code = '';

            const getThumbnail = async (isbn) => {
        let rsult = "";

        let imageUrl = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
        const res = await fetch(imageUrl);
        const imageBlob = await res.json();


        //const imageObjectURL = URL.createObjectURL(imageBlob);
        console.log("la rta y el image blob", res, imageBlob);
        if (imageBlob.totalItems > 0) {
            rsult = imageBlob.items[0].volumeInfo.imageLinks.thumbnail;
            console.log("la rta!!!!!", rsult);
        }

        return rsult;

    }
            
            // Create a Book
            Promise.try(function() {
                return randomNumber(1, 20000);
            }).then(function(number) {
                code = number;
                console.log("llega el thumbnail???", req.body.thumbnail);
                const book = new Book({
                title: req.body.title,
                author: req.body.author,
                category: req.body.category,
                publisher: req.body.publisher,
                isbn: req.body.isbn ? req.body.isbn : '',
                sample: req.body.sample,
                availableSamples: req.body.availableSamples ? req.body.availableSamples : req.body.sample,
                read: req.body.read ? req.body.read : false,
                pages: req.body.pages,
                notes: req.body.notes,
                rating: req.body.rating,
                thumbnail: req.body.thumbnail,
                support: req.body.support,
                tags: req.body.tags,
                location: req.body.location,
                bookCode: code,
                isActive: true
            });
 // Save Book in the database
 book
 .save(book)
 .then(data => {
     console.log("manda true");
     res.status(200).send({ message: "se guardó" });
 })
 .catch(err => {
     console.log("el error", err);
     res.status(500).send({ message: "no se guardó" });
     console.log("el book ", book);
 });
            }).catch({code: "RandomGenerationError"}, function(err) {
                console.log("Something went wrong!");
            });
           

           
        }
    });



};

// Retrieve all Books from the database.
exports.findAll = (req, res) => {
    var condition = { isActive: true };

    Book
        .find(condition)
        .collation({ locale: 'en', strength: 2 })
        .sort({ support: 1, title: 1 })
        .populate("category", 'description categoryCode', Category)
        .populate("publisher", 'description', Publisher)
        .populate("support", "description", Support)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving books."
            });
        });
};

// Find a single Book with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Book.findById(id)
        .populate("category", 'description categoryCode', Category)
        .populate("publisher", 'description', Publisher)
        .populate("support", 'description', Support)
        .then(data => {
            console.log("la dataaaa", data);
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


exports.updateAvailableResources = (req, res) => {
    console.log("entró al controlador", req.params.availableResources);

    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    let isActive = req.params.availableResources;
    //Set status inactive (delete)
    if (isActive === 'false') {
        let result;
        console.log("pasó x el if correcto");
        Book.findById(id, function(err, docs) {
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
    //Update availableSamples
    if (isActive === 'true') {
        let currentSamples = 0;
        let result = 0;
        let returnBack = req.params.returnBack;

        Book.findById(id, function(err, docs) {
            if (err || !docs) {
                console.log("No user found");
            } else {
                if (returnBack == 'false') {
                    currentSamples = docs.availableSamples;
                    console.log(" current samples", currentSamples);
                    if (currentSamples <= 0) {
                        console.log("libro no disponible");
                        res.send(false);
                        return;
                    } else {
                        result = currentSamples - 1;
                        docs.availableSamples = result;
                        docs.save();
                        res.send(true);
                    }
                } else {
                    console.log("devuelve libro");
                    result = currentSamples + 1;
                    docs.availableSamples = result;
                    docs.save();
                    console.log("samples actualizadas", docs.availableSamples);
                }
            }
        });
    }
}



// Update a Book by the id in the request
exports.update = (req, res) => {
    console.log("pasó x el update común");
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const id = req.params.id;

    Book.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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
    const book = Borrowing.findOne({ book: id }, function(err, docs) {
        if (err || docs) {
            console.log("el libro " + id + " está prestado", docs);
            return;
        } else {
            Book.findByIdAndRemove(id)
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
        }
    });


};

// Delete all Books from the database.
exports.deleteAll = (req, res) => {
    Book.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} Books were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all books."
            });
        });
};

// Find all Books that cannot be borrowed
exports.findAllReadBooks = (req, res) => {
    Book.find({ read: false, isActive: true })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving books."
            });
        });
};

exports.findByFilter = (req, res) => {
    //  const filters = req.params.filterName;
    const filtersValue = req.params.filterValue;
    console.log("los filters", filters);
    Book.find({ publisher: filtersValue })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving books."
            });
        });
}