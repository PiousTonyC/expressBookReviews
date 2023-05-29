const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User registred succesfully"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
//   return res.send(books);
return new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    return new Promise((resolve, reject) => {
        let bookNo = req.params.isbn;
        let isbnArr = Object.keys(books);
        if (isbnArr.includes(bookNo)) {
          resolve(books[bookNo]);
        } else {
          reject(new Error('Invalid ISBN !!'));
        }
      })
        .then((data) => {
          res.send(data);
        })
        .catch((error) => {
          console.error('Error:', error.message);
          res.send(error.message);
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',(req, res) => {
    return new Promise((resolve, reject) => {
      let temp = [];
      let isbnArr = Object.keys(books);
      let author = req.params.author;
      isbnArr.forEach((value) => {
        if (books[value].author === author) {
          temp.push(books[value]);
        }
      });
      resolve(temp);
    })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
      });
  });

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    return new Promise((resolve, reject) => {
      let temp = [];
      let isbnArr = Object.keys(books);
      let title = req.params.title;
      isbnArr.forEach((value) => {
        if (books[value].title === title) {
          temp.push(books[value]);
        }
      });
      resolve(temp);
    })
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let bookNo = req.params.isbn;
  let isbnArr = Object.keys(books);
  if (isbnArr.includes(bookNo)){
      const review = books[bookNo].reviews
      if(review.length > 0 ){
      return res.send(books[bookNo].reviews)
    }
    else{
        return res.json({message:"No reviews available for this book"});
    }
  }
  else{
      return res.send("Invalid isbn !!")
  }
  
});

module.exports.general = public_users;
