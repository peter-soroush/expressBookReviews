const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
const public_users = express.Router();

// Hidden internal endpoint allowing Axios to fetch raw data explicitly
public_users.get("/books/data", function (req, res) {
  return res.status(200).json(books);
});

// Task 10: Get all books using async/await with Axios
public_users.get("/", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books/data");
    return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  axios
    .get(`http://localhost:5000/books/data`)
    .then((response) => {
      const book = response.data[isbn];
      if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching book details" });
    });
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get("/author/:author", async function (req, res) {
  try {
    const targetAuthor = req.params.author;
    const response = await axios.get("http://localhost:5000/books/data");
    const allBooks = response.data;
    const bookKeys = Object.keys(allBooks);
    let matchingBooks = [];

    bookKeys.forEach((key) => {
      if (allBooks[key].author === targetAuthor) {
        matchingBooks.push({ isbn: key, ...allBooks[key] });
      }
    });

    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error processing request" });
  }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get("/title/:title", async function (req, res) {
  try {
    const targetTitle = req.params.title;
    const response = await axios.get("http://localhost:5000/books/data");
    const allBooks = response.data;
    const bookKeys = Object.keys(allBooks);
    let matchingBooks = [];

    bookKeys.forEach((key) => {
      if (allBooks[key].title === targetTitle) {
        matchingBooks.push({ isbn: key, ...allBooks[key] });
      }
    });

    if (matchingBooks.length > 0) {
      return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error processing request" });
  }
});

// Task 5: Get book review (Public Route)
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 6: Register Route (Safely references the users array from auth_users)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const sharedUsers = require("./auth_users.js").users;
  const doesExist = sharedUsers.filter((user) => user.username === username);

  if (doesExist.length > 0) {
    return res.status(409).json({ message: "Username already exists" });
  } else {
    sharedUsers.push({ username: username, password: password });
    return res
      .status(200)
      .json({ message: "User successfully registered. Now you can login" });
  }
});

module.exports.general = public_users;
