const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      author: String,
      category: {type: Schema.Types.ObjectId, ref: './category.model'},
      publisher: {type: Schema.Types.ObjectId, ref: './publisher.model'},
      support: {type: Schema.Types.ObjectId, ref: './support.model'},
      isbn: { type: Number, unique: true },
      sample: { type: Number, required: true },
      libraryOnly: Boolean,
      availableSamples: {type: Number},
      isActive: Boolean      
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