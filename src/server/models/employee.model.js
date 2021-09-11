module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      telephone: Number,
      email: { type: String, required: true },
      dni: { type: Number, index: true, required: true },
      address: String
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Employee = mongoose.model("employee", schema);
  return Employee;
};