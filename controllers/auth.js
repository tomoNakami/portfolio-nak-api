//npm install --save express-jwt jwks-rsa
const { expressjwt: jwt } = require('express-jwt');
const JwksRsa = require('jwks-rsa');
const request = require('request');
const config = require('../config');

// Authentication middleware
// This middleware will check access token in authorization headers
// of a request
// It will verify access token against Auth0 JSON web key set
exports.checkJwt = jwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: true,
    jwksUri: 'https://tomodev.eu.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://tomodev.eu.auth0.com/api/v2/',
  issuer: 'https://tomodev.eu.auth0.com/',
  algorithms: ['RS256']
});

exports.checkRole = role => (req, res, next) => {
  const user = req.auth;

  if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
    next();
  } else {
    return res.status(401).send('You are not authorized to access this resrouce!');
  }
}

exports.getAccessToken = (callback) => {
  const options = {
    method: 'POST',
    url: config.AUTH0_TOKEN_URL,
    headers: { 'content-type': 'application/json' },
    form: {
      grant_type: 'client_credentials',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: config.AUTH0_AUDIENCE
    }
  }

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {

      if (error) {
        reject(new Error(error))
      }

      resolve(body ? JSON.parse(body) : '');
    })
  })
}

exports.getAuth0User = accessToken => userId => {   // 🔶🔶🔶🔶🔶🔶🔶🔶🔶🔶
  const options = {
    method: 'GET',
    url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,picture,user_id`,
    headers: { authorization: `Bearer ${accessToken}` }
  };

  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (error) {
        reject(new Error(error))
      }

      resolve(body ? JSON.parse(body) : '');
    })
  })
}

