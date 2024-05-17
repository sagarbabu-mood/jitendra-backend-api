require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
const mongoString = process.env.DATABASE_URL + "?tls=true&tlsAllowInvalidCertificates=true";
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });


const database = mongoose.connection;

database.on('error', (error) => {
  console.error(error);
});


// Define the book schema
const bookSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String,
});

// Create the book model
const Book = mongoose.model('Book', bookSchema);

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// CRUD routes

// Create a new book
app.post('/books', async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.status(201).send(book);
});

// Get all books
app.get('/books', async (req, res) => {
  const books = await Book.find({});
  res.send(books);
});

// Get a single book by ID
app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).send('Book not found');
  res.send(book);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));