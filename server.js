const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('./config');
const { Note } = require('./models');

const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

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


app.put('/notes/:id', (req, res) => {
 

  Note
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Something went wrong' }));
});


app.delete('/:id', (req, res) => {
  Note
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted blog post with id \`${req.params.ID}\``);
      res.status(204).end();
    });
});


app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', (err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close((err) => {
      console.log(err);
      if (err) {
        return reject(err);
      }
      resolve();
    });
  }));
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
