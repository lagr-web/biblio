import mongoose from "mongoose";


const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .trim();
};


const contentBodySchema = new mongoose.Schema({
  type: String, // Type of content, e.g., "paragraph"
  text: String // Text content for the paragraph
},

{ _id: false } // Disable automatic `_id` generation
);


const contentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['paragraph', 'image', 'link', 'video', 'main'], // Added 'video' as a type
    required: true
  },
  text: String,  // For text content (paragraphs, links)
  altText: String, // Alt text for images and videos
  caption: String, // Caption for images and videos
  embedCode: String, // Optional, for video embeds (e.g., YouTube embed code)
  thumbnail: String, // Optional, for video thumbnail image
  contentbody: [contentBodySchema] // Array of nested paragraphs or other elements for "body" type
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: [contentSchema],
  url: String,   // URL for images, links, and videos  // Content array includes videos
  publishedAt: Number,
  section: String,
  slug:String,
  articleCategory:String,
  isLandingpage: Boolean,
  tags: [String],
  author: String,
  date: {
    type: Date,
    default: Date.now
  }
});

// Middleware to generate slug before saving
/* articleSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title);
  }
  next();
}); */

const Article = mongoose.model("Article", articleSchema);



export default Article;
