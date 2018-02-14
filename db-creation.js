const mongoose = require('mongoose');

const { DATABASE_URL } = require('./config');
const { Note } = require('./models');

mongoose.connect(DATABASE_URL, { useMongoClient: true })
  .then(() => {
    mongoose.connection.db.dropDatabase();

    return Note.create([
      {
        header: 'Can you believe this?',
        content: 'Thanks for reading',
        tags: [
          'dogs',
          'cats',
        ],
      },
      {
        header: 'Me big dummy',
        content: 'Me sad now',
        tags: [
          'sports',
          'beer',
        ],
      },
    ]).then(result => console.log(result))
      .catch((err) => {
        console.log(err);
      });
  });
