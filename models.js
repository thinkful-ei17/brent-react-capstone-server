const mongoose = require('mongoose');


const notesSchema = mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  lastEdited: { type: Date, default: Date.now },
});

notesSchema.methods.serialize = function () {
  return {
    title: this._id,
    content: this.content,
    lastEdited: this.lastEdited,
  };
};

const Note = mongoose.model('note', notesSchema);

module.exports = { Note };
