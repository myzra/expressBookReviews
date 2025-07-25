const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log(users)
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password"});
  }

  const user = users.find(u => 
    u.username === username.trim() && u.password === password.trim()
  );
  
  if(!user) {
    return res.status(401).json({ message: "Invalid credentials"});
  }

  const accessToken = jwt.sign({ username: user.username }, 'access', { expiresIn: '1h'});

  req.session.authorization = {
    accessToken,
    username: user.username
  };

  return res.status(200).json({ message: "Login successful", accessToken});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const u = req.session.authorization?.username;

  if(!u) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if(!review) {
    return res.status(400).json({ message: "No review provided" });
  }

  const b = books[isbn];

  if(!b) {
    return res.status(400).json({ message: "No book found" });
  }

  b.reviews[u] = review;

  return res.status(200).json({
    message: "Review successfully added/updated",
    reviews: b.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if(!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const book = books[isbn];
  if(!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: book.review });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
