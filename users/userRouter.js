const express = require('express');
const db = require('./userDb');
const postDB = require('../posts/postDb')
  ;
const { logger } = require('../server.js');
const { json } = require('express');
const { count } = require('../data/dbConfig');

const router = express.Router();
router.use(express.json());



router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'There was an error while saving to the database' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const post = req.body
  postDB.insert(post)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ message: 'There was an error saving post to database.' });
    })
})

router.get('/', (req, res) => {
  db.get(req.query)
    .then(all => {
      res.status(200).json(all);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'information could not be retrieved' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'user could not be retrieved.' });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  posts = req.params.posts
  db.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ message: 'There was an error retrieving posts from the database.' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      res.status(200).json({ message: 'User is deleted!' });
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be removed.' });
    });
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  changes = req.body;
  db.update(req.params.id, changes)
    .then(changes => {
      res.status(200).json(changes);
    })
    .catch(err => {
      res.status(500).json({ error: 'The user information could not be modified.' });
    })
});

//custom middleware

function validateUserId(req, res, next) {
  if (!req.params.id) {
    res.status(400).json({ message: "invalid user id" });
  } else {
    next();
  }
};


function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else {
    if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    }
    next();
  };
};

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else {
    if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    }
    next();
  };
};

router.post('/', validateUser);
router.put('/:id', validateUser);
router.post('/:id/posts', validatePost);

module.exports = router;
