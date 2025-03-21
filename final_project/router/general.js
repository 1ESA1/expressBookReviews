const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = require('express').Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send a JSON response containing the users array, formatted with an indentation of 4 spaces for readability
    res.send(JSON.stringify({ users }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Get isbn details

    // Search for the book by swiping through the keys of the object books
    let bookDetails = null;
    for (const key in books) {
        if (books[key].isbn === isbn) {
            bookDetails = books[key];
            break;
        }
    }

    if (bookDetails) {
        res.status(200).json({
            message: "Dettagli del libro trovati",
            data: bookDetails
        });
    } else {
        res.status(404).json({
            message: "Libro non trovato per l'ISBN fornito"
        });
    }
 });
 module.exports = public_users;
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
