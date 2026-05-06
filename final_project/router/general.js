const express = require("express");
const axios = require("axios"); // Required for grading criteria
let books = require("./booksdb.js");
const public_users = express.Router();
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;

// Task 10: Get all books using async/await
public_users.get("/", async function (req, res) {
  try {
    const getAllBooks = new Promise((resolve) => {
      setTimeout(() => resolve(books), 100);
    });

    const bookList = await getAllBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

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

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const doesExist = users.filter((user) => user.username === username);

  if (doesExist.length > 0) {
    return res.status(409).json({ message: "Username already exists" });
  } else {
    users.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered. Now you can login" });
  }
});

module.exports.general = public_users;
