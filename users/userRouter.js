const express = require('express');
const db = require('./userDb');
const postDB = require('../posts/postDb');
const { json } = require('express');

const router = express.Router();

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

router.get('/:id/posts', validatePost, validateUserId, (req, res) => {
  // do your magic!
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  if (!req.params.id) {
    res.status(400).json({ message: "invalid user id" });
  } else {
    req.user = req.params.id
  }
  next();
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
router.use(validateUserId, validateUser, validatePost);

module.exports = router;
