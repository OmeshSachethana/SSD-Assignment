const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')
const passport = require('passport')
const jwt = require('jsonwebtoken')

router.route('/').post(loginLimiter, authController.login)

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
)

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication, generate JWT
  const accessToken = jwt.sign(
    {
      UserInfo: {
        uid: req.user._id.toString(),
        username: req.user.username,
        roles: req.user.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '60m' }
  )
  
  res.redirect(`http://localhost:3000/tours?accessToken=${accessToken}`);
})

module.exports = router
