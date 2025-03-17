import mongoose from "mongoose";

const genresBookSchema = new mongoose.Schema({
    
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },

  genre: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String, // Sti til billedet
    required: false, // Optional, hvis ikke et billede uploades
  }


});

genresBookSchema.index(
  { title: "text", author: "text", genre: "text" },
  { weights: { title: 5, author: 3, genre: 2 } } // Prioriterer titler i søgning
);

const GenreBooks = mongoose.model("books", genresBookSchema);

export default GenreBooks;
