module.exports = mongoose => {
    const Book = mongoose.model(
      "book",
      mongoose.Schema(
        {
          title: String,
          author: String,
          category: String,
          publisher: String,
          available: Boolean
        },
        { timestamps: true }
      )
    );
  
    return Book;
  };