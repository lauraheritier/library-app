const db = require("../models");
const Member = db.members;
const Borrowing = db.borrowings;

// Create and Save a new member
exports.create = (req, res) => {
    // Validate request
    if (!req.body.email) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }

    Member.findOne({ dni: req.body.dni }).select("dni").lean().then(result => {
        if (result && req.body.dni !== '') {
            console.log("existe el socio!", req.body.dni, "existe ");
            res.status(400).send({ message: "no puede haber duplicados" });
            return;
        } else {

            // Create a member
            const member = new Member({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                telephone: req.body.telephone,
                email: req.body.email,
                dni: req.body.dni,
                address: req.body.address,
                isActive: true,
                membership_id: "S-" + req.body.dni
            });

            // Save member in the database
            member
                .save(member)
                .then(data => {
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send({
                        message: err.message || "Some error occurred while creating the member."
                    });
                });
        }

    });
};

// Retrieve all members from the database.
exports.findAll = (req, res) => {
    var condition = { isActive: true }
    Member.find(condition)
        .collation({ locale: 'en', strength: 2 }).sort({ first_name: 1, last_name: 1 })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving members."
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
exports.updateIsActive = (req, res) => {
        let result;
        var id = req.params.id;
        //Set status inactive (delete)
        console.log("pasó x el if correcto");
        Member.findById(id, function(err, docs) {
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
    const member = Borrowing.findOne({ member: id }, function(err, docs) {
        if (err || docs) {
            console.log("el usuario " + id + " tiene libros prestados", docs);
            return;
        } else {
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
        }
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
                message: err.message || "Some error occurred while removing all members."
            });
        });
};