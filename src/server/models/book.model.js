const { Schema } = require("mongoose");

module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: {type: String, required: true},
      author: {type: String, required: true},
      category: {type: Schema.Types.ObjectId, ref: './category.model', required: true},
      publisher: {type: Schema.Types.ObjectId, ref: './publisher.model', required: true},
      support: {type: Schema.Types.ObjectId, ref: './support.model', required: true},
      isbn: { type: Number },
      sample: { type: Number, required: true },
      read: Boolean,
      availableSamples: {type: Number},
      pages: {type: Number},
      notes: {type: String},
      rating: {type: Number},
      thumbnail: {type: String},
      tags: [{id:{type: String}, text: {type: String}}],
      location: {type: String},
      bookCode: {type: String},
      isActive: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};