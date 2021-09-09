module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      first_name: String,
      last_name: String,
      telephone: Number,
      email: String,
      dni: Number,
      address: String,
      membership_id: Number
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Member = mongoose.model("member", schema);
  return Member;
};