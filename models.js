const mongoose = require('mongoose');


const notesSchema = mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  lastEdited: { type: Date, default: Date.now },
});

notesSchema.methods.serialize = function () {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    tags: this.tags,
    lastEdited: this.lastEdited,
  };
};

const Note = mongoose.model('note', notesSchema);

module.exports = { Note };
