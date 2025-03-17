import mongoose from "mongoose";

const genresSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }

});

const Genres = mongoose.model("genres", genresSchema);

export default Genres;
