const passport = require('passport');
const config = require('../lib/config');

// If authenticated continue
// If not and auth header is present, try authenticated with http basic
// Otherwise redirect user to signin
module.exports = function mustBeAuthenticatedOrChartLinkNoAuth(req, res, next) {
  if (req.isAuthenticated() || !config.get('tableChartLinksRequireAuth')) {
    return next();
  }
  if (req.headers.authorization) {
    return passport.authenticate('basic', { session: false })(req, res, next);
  }
  res.redirect(config.get('baseUrl') + '/signin');
};
