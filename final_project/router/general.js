const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already taken" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const b = JSON.stringify(books)
  return res.status(200).send(b);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn =  req.params.isbn;
  const b = books[isbn];
  
  if(b) {
    return res.status(200).json(b);
  } else {
    return res.status(404).json({ message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const a = req.params.author;
  const bArray = Object.values(books)
  const b = bArray.filter(book => book.author === a);
  
  if(b) {
    return res.status(200).json(b);

  } else {
    return res.status(404).json({ message: "No books found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const t = req.params.title;
  const bArray = Object.values(books);
  const b = bArray.filter(book => book.title === t);
  
  if(b) {
    return res.status(200).json(b);
  } else {
    return res.status(404).json({ message: "No books found"})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]) {
    return res.status(200).json(books[isbn].reviews)
  } else {
    return res.status(404).json({ message: "No books found"});
  }
});

module.exports.general = public_users;
