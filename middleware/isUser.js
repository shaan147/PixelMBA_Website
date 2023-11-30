// Middleware to check if the user is authenticated and email is verified
module.exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated() && req.user.emailVerified) {
      return next();
    } else {
      res.redirect('/'); 
    }
  };