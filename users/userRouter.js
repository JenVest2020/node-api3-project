const express = require('express');
const db = require('./userDb');
const postDB = require('../posts/postDb');
const router = express.Router();

router.get('/', (req, res) => {
  db.get(req.query)
    .then(all => {
      res.status(200).json(all);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'information could not be retrieved' });
    });
});

router.post('/', validateUser, (req, res) => {
  let user = req.body;
  db.insert(user)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'There was an error while saving to the database' });
    });
});

router.post('/:id/posts', validatePost, (req, res) => {
  let resource = req.body;
  let user_id = req.params.id;
  postDB.insert(resource)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      res.status(500).json({ message: 'There was an error saving post to database.' });
    })
});

router.get('/:id', validateUserId, (req, res) => {
  let id = req.params.id;
  db.getById(id)
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
  let id = req.params.id
  db.getById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: 'Invalid user id.' });
      } else {
        req.user = user;
        next();
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function validateUser(req, res, next) {
  let body = req.body;
  let name = req.body.name;
  if (!body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
};

function validatePost(req, res, next) {
  let body = req.body;
  let text = req.body.text;
  if (!body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
};

module.exports = router;
