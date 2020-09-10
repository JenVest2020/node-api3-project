const express = require('express');
const postDb = require('./postDb');
const userDb = require('../users/userDb');

const router = express.Router();
router.use(express.json());
// router.use(validatePostId);

router.get('/', (req, res) => {
  postDb.get(req.query)
    .then(all => {
      res.status(200).json(all);
    })
    .catch(err => {
      res.status(500).json({ error: 'The information could not be retrieved.' });
    })
});

router.get('/:id', validatePostId, (req, res) => {
  postDb.getById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: 'post could not be retrieved.' });
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  postDb.remove(req.params.id)
    .then(count => {
      res.status(200).json({ message: 'Post is deleted!' });
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be removed.' });
    })
});

router.put('/:id', validatePostId, (req, res) => {
  changes = req.body;
  postDb.update(req.params.id, changes)
    .then(changes => {
      res.status(200).json(changes);
    })
    .catch(err => {
      res.status(500).json({ error: 'The post information could not be modified' });
    })
});

// custom middleware

function validatePostId(req, res, next) {
  if (!req.params.id && req.url === '/:id') {
    res.status(400).json({ message: 'invalid post id' });
  } else {
    next();
  }
};

module.exports = router;
