import express from 'express';
import UserDAO from './daos/user.mjs';

import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";

// Represents a class that defines the authentication routes for the application.
class Authenticator {

  /**
   * @param  app - express application instance
   */
  constructor(app) {
    this.app = app;
    this.dao = new UserDAO();
    this.initAuth();
  }


  initAuth() {

    //Session configuration
    this.app.use(
      session({
        secret: 'secret lottery key!!',
        resave: false, //save only when the session is modified
        saveUninitialized: false, //do not create empty ones
        maxAge: 7 * 24 * 60 * 60 * 1000, //1 week
      })
    );

    this.app.use(passport.initialize()); // Initialize passport
    this.app.use(passport.session()); // Initialize passport session

    const copyThis = this;

    /**
     * Sets up the local strategy for passport: retrieves the user from the database and compares the passwords.
     */
    passport.use(
      new LocalStrategy((username, password, done) => {
        copyThis.dao.checkLoginData(username, password).then((authenticated) => {
          if (authenticated) {
            return done(null, username);
          } else {
            return done(null, false, { message: 'Incorrect username and/or password' });
          }
        });
      })
    );

    /**
     * Called when a user is authenticated and the user is serialized to the session.
     */
    passport.serializeUser((username, done) => {
      done(null, username);
    });

    /**
     * Deserializes the user from the session.
     * It retrieves the username from the database and the points and returns them.
     */
    passport.deserializeUser((username, done) => {
      this.dao
        .getUserByUsername(username)
        .then((user) => {
          done(null, user);
        })
        .catch((err) => {
          done(null, err);
        });
    });
  }

  /**
   * Uses the passport.authenticate method to log in a user.
   * @returns A Promise that resolves to the logged in user or rejects with an error message.
   */
  login(req, res, next) {
    return new Promise((resolve, reject) => {
      passport.authenticate('local', (err, user, info) => { // Authenticate the user with the local strategy

        if (err) return reject(err);

        if (!user) return reject(info);

        req.login(user, (err) => { // Serialize the user to the session
          if (err) return reject(err);
          return resolve(req.user);
        });
      })(req, res, next);
    });
  }

  /**
   * Logs out the user.
   * @returns A Promise that resolves to null.
   */
  logout(req, res, next) {
    return new Promise((resolve, reject) => {
      req.logout(() => resolve(null));
    });
  }

  /**
   * Middleware function to check if the user is logged in.
   * If the user is authenticated, it calls the next middleware function. Otherwise, it returns a 401 error response.
   */
  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();

    return res.status(401).json({ message: 'Unauthenticated user' });
  }

  /**
  * Middleware function to check if the user is NOT logged in.
  * If the user is NOT authenticated, it calls the next middleware function. Otherwise, it returns a 401 error response.
  */
  isNotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.status(401).json({ message: 'User already authenticated' });
  }

}

export default Authenticator;
