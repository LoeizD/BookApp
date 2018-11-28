const fs = require('fs')
require('dotenv').config()
const mongoose = require('mongoose')


// a tool to parse a book in a mongo db, run once

const bookPath = process.argv[2]

if (bookPath == undefined) {
    console.error("Error: No Book specified as argument.")
    console.error("> node parse-book.js <yourbook.txt>")
    return
}

const bookFile = fs.readFileSync(bookPath, "utf8")
const bookData = bookFile.split("---")
const bookText = bookData[bookData.length - 1]
const bookWords = bookText.split(" ")
bookWordsObj = bookWords.map(e => {return {word: e, locked: true}})

console.log(bookWords.length + " words in book");
console.log(bookWordsObj[10] + " spec " + bookWordsObj[10].word)

// mongoose.connect(process.env.MLAB_URI);
mongoClient.connect(process.env.MLAB_URI2, {
  auth: {
   user: process.env.MLAB_USERNAME,
   password: process.env.MLAB_PW,
  }}, function (err, db) {
  db.close();
});

const Word = mongoose.model('Word', {
     word: {type: String, required: true},
     locked: { type: Boolean, default: true , required: true}
    });



Word.create(bookWordsObj, (err, data) => {
    if (err) return err
    console.log("Success creating the word database.")
})
