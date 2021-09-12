module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      description: { type: String, unique: true, required: true }
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Category = mongoose.model("category", schema);
  return Category;
};