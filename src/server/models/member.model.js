
module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      telephone: Number,
      email: { type: String, required: true, match: /.+\@.+\..+/, },
      dni: { type: Number, unique: true, required: true },
      address: String,
      membership_id: { type: String, unique: true },
      isActive: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Member = mongoose.model("member", schema);
  return Member;
};