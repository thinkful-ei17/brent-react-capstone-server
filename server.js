const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { CLIENT_ORIGIN, PORT } = require('./config');
const { dbConnect } = require('./db-mongoose');
const { Note } = require('./models');

const app = express();

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
  skip: (req, res) => process.env.NODE_ENV === 'test',
}));

app.use(bodyParser.json());
app.use(cors({
  origin: CLIENT_ORIGIN,
}));

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', (err) => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

app.get('/notes', (req, res) => {
  Note
    .find()
    .then((posts) => {
      res.json(posts.map(note => note.serialize()));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

// app.get('/notes/:id', (req, res) => {
//   Note
//     .findById(req.params.id)
//     .then(note => res.json(note.serialize()))
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ error: 'something went horribly awry' });
//     });
// });

app.post('/notes', (req, res) => {
  Note
    .create({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
    })
    .then(post => res.json(post.serialize()))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});


app.delete('/notes/:id', (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


app.put('/notes/:id', (req, res) => {
  const updated = {
    title: req.body.title,
    content: req.body.content,
  };
  Note
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedNote => {
      res.json(updatedNote.serialize());
    })
    .catch(err => res.status(500).json({ message: err }));
});


module.exports = { app };
