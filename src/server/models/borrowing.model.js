const { Schema } = require("mongoose");


module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      book: { type: Schema.Types.ObjectId, ref: './book.model' },
      member: {
        type: Schema.Types.ObjectId,
        ref: './member.model'
        
      },
      fromDate: Date,
      toDate: Date,
      cancelled: Boolean //funciona igual que el isActive
          }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Borrowing = mongoose.model("borrowings", schema);
  return Borrowing;
};