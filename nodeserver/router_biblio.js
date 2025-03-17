import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import * as argon2 from "argon2";

import Genres from "./models/Genres.js";
import GenreBooks from "./models/Books.js";
import GenreBooksDetails from "./models/BooksDetails.js";
import User from "./models/User.js";

//import formidable from "formidable";

import { dirname } from "path";
import { fileURLToPath } from "url";

import Image from "./models/Images";
import path from "path";

import fileUpload from "express-fileupload";
import fs from 'fs-extra';


const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config();

const router = express.Router();

router.use(express.json());

router.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    // Specify the upload directory directly
    uploadDir: "./images", // Assuming 'images' is a directory in the same directory as your script
  })
);

const slugify = (text) => {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .trim(); // Remove any trailing spaces
};


router.get("/test", (request, response) => {
  response.send("Allo, Ready for creating some enemies pop!");
});

router.get("/genres", async (request, response) => {
  try {
    const genre = await Genres.find();
    response.json(genre);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/genre/:slug", async (req, res) => {
  const { slug } = req.params;

  console.log("Slug received:", slug);

  try {
    // Fetch the genre by slug from the database
    const genre = await GenreBooks.find({ genre: slug });

    if (!genre) {
      console.log("No section found for slug:", slug);
      return res.status(404).send({ error: "Section not found" });
    }

    // Return the section data
    res.json(genre);
  } catch (error) {
    console.error("Error fetching section:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/book/:slug", async (req, res) => {
  const { slug } = req.params;

  console.log("Slug received:", slug);

  try {
    const book = await GenreBooks.findOne({ slug });

    if (!book) {
      console.log("No book found for slug:", slug);
      return res.status(404).send({ error: "Book not found" });
    }

    const bookDetails = await GenreBooksDetails.findOne({
      book: book._id,
    }).populate("book");

    res.json({
      ...book.toObject(),
      description: bookDetails ? bookDetails.description : "No description available",
      image: bookDetails ? bookDetails.image : "No image available",
    });
  } catch (error) {
    console.error("Error fetching book:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});


router.post("/addbook", async (req, res) => {
  // console.log("Request files:", req.files); // Log hele req.files

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const imageFile = req.files?.image; // Hent billedfilen fra request

    const fileExtension = path.extname(imageFile.name);// Hent filtypen fra filnavnet
    const fileName = `${Math.random().toString(36).slice(2, 11)}${fileExtension}`;// Generer et tilfældigt filnavn
    const filePath = `./images/${fileName}`;// Opret filsti

    // Flyt filen og vent på, at det er færdigt
    await imageFile.mv(filePath);// Flyt filen til den ønskede mappe

    const { title, author, genre, description, slug } = req.body;// Hent data fra request body

    // 1. Opretter en slug hvis ikke der er nogen angivet.
    let finalSlug = slug || slugify(title); // Opretter slug fra title
    //const finalSlug = slug || `${slugify(title)}-${Date.now()}`;

    const existingSlug = await GenreBooks.findOne({ slug: finalSlug });// Tjekker om slug allerede eksisterer

    // Hvis slug allerede eksisterer, tilføj en tilfældig streng
    if (existingSlug) {
      finalSlug = `${slugify(title)}-${Math.random()
        .toString(36)
        .slice(2, 11)}`;
    }

    // 2. Opretter ny bog i GenreBooks collection
    const book = new GenreBooks({
      title,
      author,
      genre,
      slug: finalSlug, // inkluere slug i book
    });
    await book.save(); // Gemmer bogen

    //Opretter bog details i BookDetails collection med reference til bogen
    const bookDetails = new GenreBooksDetails({
      book: book._id, // referere bogen i forhold til den objecID
      description, // inkludere beskrivelse
      image: fileName, // inkludere filnavn
    });
    await bookDetails.save(); // gemmer bookDetails

    // 4. Send response
    res.status(201).json({
      message: "Book and details added successfully!",
      book,
      bookDetails,
      imageUrl: `/images/${fileName}`, // reurnerer filnavn
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to add book and details",
      details: error.message,
    });

  }

});

router.get("/books", async (request, response) => {
  try {
    const books = await GenreBooks.find();
    const bookDetails = await GenreBooksDetails.find({
      book: { $in: books.map((book) => book._id) },
    });

    const booksWithDetails = books.map((book) => {
      const details = bookDetails.find((detail) =>
        detail.book.equals(book._id)
      );
      return {
        ...book.toObject(),
        description: details ? details.description : "No description available",
        image: details ? details.image : "No image available",
      };
    });

    response.json(booksWithDetails);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.get("/bookspagination", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Hent page og limit fra query params, med standardværdier

    const books = await GenreBooks.find()
      .limit(limit * 1) // Begræns antallet af resultater
      .skip((page - 1) * limit) // Spring over resultater baseret på sidenummer
      .exec();

    const count = await GenreBooks.countDocuments(); // Tæl det samlede antal dokumenter

    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update/:id", async (req, res) => {

  try {

    const id = req.params.id;// Hent book ID fra URL
    const updateData = req.body;// Hent data fra request body
    const newImage = req.files?.image;// Hent nyt billede fra request

    console.log("New image data:", newImage);

    // Find eksisterende bog og bookDetails parallelt
    const [book, bookDetails] = await Promise.all([
      GenreBooks.findById(id), // Find book by ID
      GenreBooksDetails.findOne({ book: id }) // Find related bookDetails using the book ID as a foreign key
    ]);

    // Hvis ingen bog blev fundet, returner en fejl
    if (!book) {
      return res.status(404).json({ message: "Din bog blev ikke fundet" });
    }

    // Hvis ingen bookDetails blev fundet, returner en fejl
    if (!bookDetails) {
      return res.status(404).json({ message: "Ekstra information blev ikke fundet" });
    }

    //**ændre din express server navngivning her */
    const serverRoot = process.env.SERVER_ROOT || 'nodeserver';  // Brug 'nodeserver' som standardværdi
    const imagesPath = process.env.IMAGES_PATH || 'images'; // Brug 'images' som standardværdi

    // Hvis der er et gammelt billede, forsøg at slette det
    if (newImage && bookDetails.image) {
      const oldImageName = bookDetails.image.replace(/^images\//, '');  // Fjern 'images/' hvis det findes
      const oldImagePath = path.resolve(__dirname, "..", serverRoot, imagesPath, oldImageName); // Brug path.join konsekvent

      console.log("Sletter gammel fil:", oldImagePath); // Log filsti for at sikre, at den er korrekt

      try {

        await fs.promises.unlink(oldImagePath);  // Asynkront sletning af gammel fil
        console.log("Gammel fil slettet.");
      } catch (err) {
        console.error("Fejl ved sletning af gammel fil:", err);
      }

    }

    // Gem nyt billede, hvis en ny fil er uploadet
    let imagePath = bookDetails.image;

    // Hvis der er et nyt billede, gem det og opdater filstien
    if (newImage) {
      const randomName = Math.random().toString(36).slice(2, 11); // Generer tilfældig streng
      const fileExtension = path.extname(newImage.name); // Behold filens oprindelige extension
      const newFileName = `${randomName}${fileExtension}`; // Kombiner tilfældig streng og extension

      // Opret filsti til upload
      const uploadPath = path.join(__dirname, "..", serverRoot, imagesPath, newFileName);
      await newImage.mv(uploadPath);  // Flyt filen til den ønskede mappe
      imagePath = newFileName;  // Opdater filsti
    }

    // Opdater book med de nye data
    const updatedBook = await GenreBooks.findByIdAndUpdate(
      id,
      {
        title: updateData.title,
        author: updateData.author,
        genre: updateData.genre,
        slug: updateData.slug,  // Sørg for, at slug også opdateres
      },
      { new: true } // Returner den opdaterede bog
    );

    // Opdater bookDetails med det nye billede og beskrivelse
    const updatedBookDetails = await GenreBooksDetails.findOneAndUpdate(
      { book: id },
      {
        description: updateData.description,
        image: imagePath,  // Opdater billede sti
      },
      { new: true }
    );

    res.json({
      message: "Din bog blev opdateret!",
      book: updatedBook,
      bookDetails: updatedBookDetails,
    });

  } catch (error) {
    console.error("Fejl i opdateringen:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {

  try {
    const id = req.params.id; // Book ID

   //sletter bogen
    const deletedBook = await GenreBooks.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Ingen bog fundet" });
    }

    // slet detaljer om bogen
    const deletedBookDetails = await GenreBooksDetails.findOneAndDelete({
      book: id,
    });

    // Hvis der et billede, forsøg at slette det
    if (deletedBookDetails && deletedBookDetails.image) {
      const serverRoot = process.env.SERVER_ROOT || 'nodeserver';  // Brug 'nodeserver' som standardværdi
      const imagesPath = process.env.IMAGES_PATH || 'images'; // Brug 'images' som standardværdi

      const imageFileName = deletedBookDetails.image.replace(/^images[\\/]/, ''); // Fjern 'images/' hvis det findes
      const imagePath = path.join(__dirname, "..", serverRoot, imagesPath, imageFileName); // Opret filsti

      try {
        await fs.promises.unlink(imagePath);
        console.log("Billedet blev slettet:", imagePath);
      } catch (err) {
        console.error("Fejl ved sletning af billedet:", err);
      }
    }

    // Returner en bekræftelse
    res.json({
      message: "Din bog blev slettet",
      book: deletedBook,
      bookDetails: deletedBookDetails || "Ingen bog fundet.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    // Find the book based on the ID
    const book = await GenreBooks.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Ingen bog fundet" });
    }

    // Fetch the description from the bookDetails collection using the book's _id
    const bookDetails = await GenreBooksDetails.findOne({ book: book._id });

    // Fetch all unique genres
    const genres = await GenreBooks.distinct("genre");

    // Return the book, genres, and the description
    res.json({
      book,
      genres,
      description: bookDetails
        ? bookDetails.description
        : "Ingen beskrivelse tilgængelig",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (request, response) => {
  try {
    const { query } = request.query;
    if (!query) {
      return response
        .status(400)
        .json({ message: "Query parameter is required" });
    }

    let books = [];

    if (query.length > 3) {
      // Full-text søgning for længere søgninger
      books = await GenreBooks.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      ).sort({ score: { $meta: "textScore" } });
    } else {
      // Regex-søgning for kortere forespørgsler (autosuggest)
      books = await GenreBooks.find({
        $or: [
          { title: { $regex: `^${query}`, $options: "i" } },
          { author: { $regex: `^${query}`, $options: "i" } },
          { genre: { $regex: `^${query}`, $options: "i" } },
        ],
      });
    }

    // Find alle bookDetails baseret på de fundne bøgers IDs
    const bookDetails = await GenreBooksDetails.find({
      book: { $in: books.map((book) => book._id) },
    });

    // Kombiner bøgerne med deres detaljer
    const booksWithDetails = books.map((book) => {
      const details = bookDetails.find((detail) =>
        detail.book.equals(book._id)
      );
      return {
        ...book.toObject(),
        description: details
          ? details.description
          : "Ingen beskrivelse tilgængelig",
        image: details
          ? details.image
          : "Ingen billede tilgængelig",
      };
    });

    response.json(booksWithDetails);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: error.message });
  }
});

router.post("/upload", (req, res, next) => {
  const form = formidable({
    uploadDir: "./images", // Adjust the path as needed
    // Keep file extensions (e.g., .png, .jpg)
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    console.log(files.image[0].newFilename);
    try {
      if (err) {
        next(err);
        return;
      }

      const uploadedFile = files.image[0];
      const imageName = uploadedFile.newFilename;

      const data = new Image({
        image: imageName,
      });

      const savedImage = await data.save();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
    //res.json({ fields, files });
  });
});

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  try {
    // Find brugeren via email
    const user = await User.findOne({ email });

    // Tjek om brugeren eksisterer og verificer adgangskoden med Argon2
    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ error: 'Ugyldige legitimationsoplysninger' });
    }

    // Gem brugerens ID i sessionen
    req.session.userId = user._id;

    console.log(req.session);

    res.json({ message: 'Du er nu logget ind' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Der opstod en uventet fejl' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email og password er påkrævet' });
    }

    // Tjek om emailen allerede er registreret
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Emailen er allerede registreret' });
    }

     // Hash adgangskoden med Argon2
    const hashedPassword = await argon2.hash(password);

     // Opret en ny bruger
    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Gem den nye bruger i databasen
    await newUser.save();

    res.status(201).json({ message: 'Din bruger er oprettet' });

  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ error: 'En uventet fejl opstod' });
  }
});

router.post('/logout', (req, res) => {
  res.cookie('biblio-session', '', { 
      httpOnly: true, 
      expires: new Date(0), // Udløber med det samme
      path: '/' 
  });
  res.status(200).json({ message: 'Logget ud' });
});

export default router;
