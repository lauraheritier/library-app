var Publisher = require("./publisher.model");
var Category = require("./category.model");
const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      author: String,
      category: {type: Schema.Types.ObjectId, ref: './category.model'},
      publisher: {type: Schema.Types.ObjectId, ref: './publisher.model'},
      borrowed: Boolean,
      isbn: { type: Number, index: true }
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};