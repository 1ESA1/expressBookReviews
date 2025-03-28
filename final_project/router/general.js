const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = require('express').Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/books');
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching the list of books", error: error.message });
  }
});

// Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/books/isbn/:isbn', async (req, res) => {
    let isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});
 
 module.exports = public_users;
  
//Get book details based on Author using Promise callbacks or async-await with Axios
public_users.get('/books/author/:author', async (req, res) => {
    let author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

//Get book details based on Title using Promise callbacks or async-await with Axios
public_users.get('/books/title/:title', async (req, res) => {
    let title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Get isbn details

    // Search for the book by swiping through the keys of the object books
    let bookReviews = null;
    for (const key in books) {
        if (books[key].isbn === isbn) {
            bookReviews = books[key].reviews;
            break;
        }
    }
    
    if (bookReviews) {
        res.status(200).json(bookReviews);
    } else {
        res.status(404).json({message: 'Nessuna recensione trovata per questo isbn.' }); //Messaggio di errore
    }
 });
 module.exports = public_users;

module.exports.general = public_users;
