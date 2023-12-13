import express from 'express';
import passport from '../passport';

const router = express.Router();

const appUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/';

// BASE/auth/login
router.get('/login', passport.authenticate('twitch'));

// BASE/auth/callback
router.get(
  '/callback',
  passport.authenticate('twitch', {
    successRedirect: appUrl,
    failureRedirect: `${appUrl}unauthorized`,
  }),
);

// BASE/auth/logout
router.get('/logout', (req, res, next) => {
  req.session.destroy(function () {
    res.redirect(`${appUrl}logout`);
  });
});

export default router;
