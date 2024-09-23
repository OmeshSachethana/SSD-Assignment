const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:2000/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id })

        if (existingUser) {
          return done(null, existingUser)
        }

        const newUser = await new User({
          googleId: profile.id,
          username: profile.displayName,
          first_name: profile.name.givenName || '',
          last_name: profile.name.familyName || '',
          email: profile.emails[0].value || '', // Assuming email is required
          // Add default values or retrieve additional info if possible
          gender: profile.gender || 'Not Specified', // If gender is not provided in Google profile
          dob: '2000-01-01', // Set a default value or handle it later if Google profile doesn't provide it
          password: 'google_auth_user', // You need a placeholder or a method to generate a password for OAuth users
          mobile: 'N/A' // Set a placeholder if not available
        }).save()

        done(null, newUser)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user)
  })
})

// Login
// POST /auth
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Please Enter Credentials' })
  }

  const foundUser = await User.findOne({ username }).exec()

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: 'Unauthorized' })

  const accessToken = jwt.sign(
    {
      UserInfo: {
        uid: foundUser._id.toString(),
        username: foundUser.username,
        roles: foundUser.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '60m' }
  )
  res.json({ accessToken })
})

module.exports = {
  login,
  passport
}
