module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      author: String,
      category: String,
      publisher: String,
      available: Boolean
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};