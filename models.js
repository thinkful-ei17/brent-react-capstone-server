const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
});


const Note = mongoose.model('note', notesSchema);

module.exports = { Note };
