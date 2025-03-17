import mongoose from "mongoose";

const genresBookDetailSchema = new mongoose.Schema({

  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "books", // Reference til Books collection
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Sti til billedet
    required: false, // Optional, hvis ikke et billede uploades
  }

});

const GenreBooksDetails = mongoose.model("bookDetails",genresBookDetailSchema,"bookDetails");

export default GenreBooksDetails;
