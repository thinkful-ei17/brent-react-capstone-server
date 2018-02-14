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
    .then((notes) => {
      res.json(notes);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

app.get('/notes/:id', (req, res) => {
  Note
    .findById(req.params.id)
    .then(note => res.json(note))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'something went horribly awry' });
    });
});

app.post('/notes', (req, res) => {
  Note
    .create({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
    })
    .then(note => res.status(200).json(note))
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


// app.put('/notes/:id', (req, res) => {


//   Note
//     .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
//     .then(updatedPost => res.status(204).end())
//     .catch(err => res.status(500).json({ message: 'Something went wrong' }));
// });


app.delete('/:id', (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});


module.exports = { app };
