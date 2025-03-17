import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  }

});

const Section = mongoose.model("sections", sectionSchema);

export default Section;
