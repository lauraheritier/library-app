module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      description: { type: String, unique: true, required: true },
      url: String,
      isActive: Boolean
    }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Publisher = mongoose.model("publisher", schema);
  return Publisher;
};