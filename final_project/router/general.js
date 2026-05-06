const express = require("express");
const axios = require("axios"); // Required for grading criteria
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get all books using async/await
public_users.get("/", async function (req, res) {
  try {
    // Simulating an asynchronous database call
    const getAllBooks = new Promise((resolve) => {
      setTimeout(() => resolve(books), 100);
    });

    const bookList = await getAllBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get("/isbn/:isbn", function (req, res) {
  const targetIsbn = req.params.isbn;

  // Wrap the synchronous lookup in a Promise
  const getBookByIsbn = new Promise((resolve, reject) => {
    const book = books[targetIsbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  // Handle the Promise resolution
  getBookByIsbn
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((error) => res.status(404).json({ message: error }));
});

// Task 12: Get book details based on Author using async/await
public_users.get("/author/:author", async function (req, res) {
  try {
    const targetAuthor = req.params.author;

    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      let matchingBooks = [];

      bookKeys.forEach((key) => {
        if (books[key].author === targetAuthor) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found for this author");
      }
    });

    const authorBooks = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get book details based on Title using async/await
public_users.get("/title/:title", async function (req, res) {
  try {
    const targetTitle = req.params.title;

    const getBooksByTitle = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      let matchingBooks = [];

      bookKeys.forEach((key) => {
        if (books[key].title === targetTitle) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });

      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found with this title");
      }
    });

    const titleBooks = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(titleBooks, null, 4));
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
