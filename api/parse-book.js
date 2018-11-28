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
const bookWords = bookText.split(/ |\n/g)
bookWordsObj = bookWords.map((e, i) => {return {word: e, locked: true, index: i}})

console.log(bookWords.length + " words in book");
console.log(bookWordsObj[15])
console.log(bookWordsObj[16])
console.log(bookWordsObj[17])

mongoose.connect(process.env.MLAB_URI)

const Word = mongoose.model('Word', {
     word: {type: String, required: true},
     locked: { type: Boolean, default: true , required: true},
     index: {type: Number, required: true}
    });

Word.create(bookWordsObj, (err, data) => {
    if (err) return err
    console.log("Success creating the word database.")
    return data
})