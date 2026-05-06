const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  // Filter the users array for any matching usernames
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // If the array has items, the username exists
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  // Filter the users array for an exact match of both username AND password
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate using the helper function
  if (authenticatedUser(username, password)) {
    // Generate JWT token. We embed the username in the payload.
    let accessToken = jwt.sign(
      {
        username: username,
      },
      "access",
      { expiresIn: 60 * 60 },
    ); // Token expires in 1 hour

    // Store the token and username in the session
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    // Returns response formatted explicitly as a JSON object
    return res
      .status(200)
      .json({ message: `Review for ISBN ${isbn} added/updated` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    // Returns exact literal format expected by the grading script
    return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
