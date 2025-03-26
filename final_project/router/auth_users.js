const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: 'username', password: 'password' },
];

const isValid = (username)=>{ 
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ 
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;

    // Check if user is authorizate in the session
    if (!req.session.authorization || !req.session.authorization.accessToken) {
        return res.status(403).json({ message: "Accesso non autorizzato. Effettua il login." });
    }

    try {
        const { username } = jwt.verify(req.session.authorization.accessToken, 'access');

        // Check if review is write
        if (!review) {
            return res.status(400).json({ message: "Recensione non fornita." });
        }

        // Search the book with isbn
        let book = null;
        for (let key in books) {
            if (books[key].isbn === isbn) {
                book = books[key];
                break;
            }
        }
        //Check if book is find
        if (!book) {
            return res.status(404).json({ message: `Libro con ISBN ${isbn} non trovato.` });
        }

        // If review not exist
        if (!book.reviews) {
            book.reviews = [];
        }

        // Check if user has posted the review
        const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
        if (existingReviewIndex !== -1) {
            // Update the review
            book.reviews[existingReviewIndex].review = review;
            return res.status(200).json({
                message: `Recensione aggiornata con successo per il libro con ISBN ${isbn}.`,
                review
            });
        } else {
            // Add new review
            book.reviews.push({ username, review });
            return res.status(200).json({
                message: `Recensione aggiunta con successo per il libro con ISBN ${isbn}.`,
                review
            });
        }
    } catch (error) {
        return res.status(401).json({ message: "Token non valido o sessione scaduta." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
