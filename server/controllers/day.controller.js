const Day = require('../models/day.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Day.find({}, (err, days) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        days,
      })
    }).sort('_id')
  },
  indexPublic: (req, res) => {
    const roundId = req.params.round
    if (!roundId) {
      return res.status(400).json({
        success: false,
        action: 'public index by round',
        message: 'No Season id provided',
      })
    }
    return Day.find({
      round: roundId,
    }).sort('_id').exec()
    .then((days) => {
      return res.json({
        success: true,
        action: 'public index by round',
        days,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'public index by round',
        message: err,
        err,
      })
    })
  },
  indexByRound: (req, res) => {
    const roundId = req.params.round
    if (!roundId) {
      return res.status(400).json({
        success: false,
        action: 'admin index by round',
        message: 'No Season id provided',
      })
    }
    return Day.find({
      round: roundId,
    })
    .sort('_id')
    .exec()
    .then((days) => {
      const promises = []
      days.forEach((day) => {
        return promises.push(day.addInfo())
      })
      return Promise.all(promises)
    })
    .then((days) => {
      return res.json({
        success: true,
        action: 'admin index by round',
        days,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'admin index by round',
        message: err,
        err,
      })
    })
  },
  getAdmin: (req, res) => {
    const dayId = req.params.id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        action: 'admin get single day',
        message: 'No Day id provided',
      })
    }
    return Day.findById(dayId).exec()
    .then((day) => {
      if (!day) {
        return Promise.reject({
          message: 'No Day id provided',
          status: 404,
        })
      }
      return res.json({
        success: true,
        day,
      })
    })
    .catch((err) => {
      return res.status(err.status ? err.status : 500).json({
        success: false,
        action: 'admin get single day',
        message: err.message ? err.message : err,
      })
    })
  },
  create: (req, res) => {
    const newDayRequest = req.body
    if (!newDayRequest) {
      return res.status(400).json({
        success: false,
        message: 'No data provided',
      })
    }
    if (!newDayRequest.season) {
      return res.status(400).json({
        success: false,
        message: 'No Season Id Provided',
      })
    }
    if (!newDayRequest.round) {
      return res.status(400).json({
        success: false,
        message: 'No round Id Provided',
      })
    }
    const newDay = new Day(newDayRequest)
    return newDay.save((err, day) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        day,
      })
    })
  },
  setLastDay: (req, res) => {
    const dayId = req.params.id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        action: 'set played last day',
        message: 'No day Id Provided',
      })
    }
    return Day.setLastDay(dayId).then((day) => {
      return res.json({
        success: true,
        day,
      })
    }).catch((err) => {
      return res.status(400).json({
        success: false,
        message: err,
      })
    })
  },
  delete: (req, res) => {
    const dayId = req.params.id
    return Day.findById(dayId)
    .then((day) => {
      if (!day) {
        return res.status(404).json({
          success: false,
          message: 'Day not found',
        })
      }
      // Cascade remove matches and their data
      return day.cascadeRemove()
    })
    .then((day) => {
      return res.json({
        success: true,
        action: 'remove day',
        day,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'remove day',
        message: err,
      })
    })
  },
}
