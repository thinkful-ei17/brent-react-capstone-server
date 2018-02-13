const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
  title: String,
  notes: [String],
  tags: [String],
});


const Note = mongoose.model('note', notesSchema);

module.exports = { Note };
