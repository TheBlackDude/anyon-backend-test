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

// calculate the distance
const earth = (function() {
  const earthRadius = 6371 // km, miles is 3959

  const getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadius)
  }

  const getRadsFromDistance = function (distance) {
    return parseFloat(distance / earthRadius)
  }

  return {
    getDistanceFromRads: getDistanceFromRads,
    getRadsFromDistance: getRadsFromDistance
  }
})()

// Generate messages
const buildMessageList = function(req, res, results, stats) {
  const messages = []
  results.forEach(function(doc) {
    messages.push({
      distance: earth.getDistanceFromRads(doc.dis),
      name: doc.obj.name
    })
  })
}

// GET list of messages by distance
router.get('/messages/distance', function(req, res) {
  const lng = parseFloat(req.body.lng)
  const lat = parseFloat(req.body.lat)
  const maxDistance = parseFloat(req.query.maxDistance)
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  }
  const geoOptions = {
    spherical: true,
    maxDistance: earth.getRadsFromDistance(maxDistance),
    num: 10
  }
  if ((!lng && lng !== 0) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params')
    return
  }
  Message.geoNear(point, geoOptions, function(err, results, stats) {
    console.log('Geo results', results)
    console.log('Geo stats', stats)
    if (err) {
      console.log('GeoNear error: ', err)
      res.send(err)
    } else {
      const messages = buildMessageList(req, res, results, stats)
      res.json(messages)
    }
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
  message.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)]

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
    message.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)]

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
