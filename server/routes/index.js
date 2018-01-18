const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')
const Message = require('../models/message')

/*
 * Authenticating and Signing Up users
 */
router.post('/login', passport.authenticate('local-login'), function(req, res) {
  // login successfull
  res.status(200)
  res.json({'user': req.user.username})
})

router.post('/signup', passport.authenticate('local-signup'), function(req, res) {
  // signup successfull
  res.status(200)
  res.json({'status': 'success'})
})

/* GET all users. */
router.get('/users', function(req, res, next) {
  User.find(function(err, users) {
    if (err) {
      res.send(err)
    }
    res.json(users)
  })
})

// GET specific user by id
router.get('/:user_id', function(req, res, next) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {
      res.send(err)
    }
    res.json(user)
  })
})

// GET all messages
router.get('/messages', function(req, res) {
  Message.find(function(err, messages) {
    if (err) {
      res.send(err)
    }
    res.json(messages)
  })
})

// GET specific message by id
router.get('/:message_id', function(req, res) {
  Message.findById(req.params.message_id, function(err, message) {
    if (err) {
      res.send(err)
    }
    res.json(message)
  })
})

// Create a message
router.post('/message', function(req, res) {
  // Create a new instance of the message model
  const message = new Message()

  // get the message (coming from the request)
  message.name = req.body.name

  // save the message
  message.save(function(err) {
    if (err) {
      res.send(err)
    }
    // everything good, give some success message
    res.json({message: 'message saved successfully'})
  })
})

// Update a specific message by id
router.put('/:message_id', function(req, res) {
  Message.findById(req.params.message_id, function(err, message) {
    if (err) {
      res.send(err)
    }
    // update the message
    message.name = req.body.name

    message.save(function(err) {
      if (err) {
        res.send(err)
      }
      // Okay, give success message
      res.json({message: 'message updated successfully'})
    })
  })
})

// Delete a specific message by id
router.delete('/:message_id', function(req, res) {
  Message.remove({_id: req.params.message_id}, function(err, message) {
    if (err) {
      res.send(err)
    }
    // Good, give some success message
    res.json({message: 'message deleted successfully'})
  })
})

module.exports = router;
