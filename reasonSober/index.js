'use strict';

var request = require('request');
request = request.defaults({jar: true});

let config = {};
let reasons = [];

const login = function(callback) {
  let options = {
    url: config.TRIGGR_API_URL + '/superUser/login',
    body: {email: config.TRIGGR_USERNAME, password: config.TRIGGR_PASSWORD},
    json: true,
    method: 'POST'
  }
  request(options, (error, response, body) => {
    console.log("LOGIN", error, response, body);
    callback();
  })
}

const updateReasonSober = function() {
  console.log('Updating reason sober');
  let options = {
    url: config.TRIGGR_API_URL + '/reasonSober?status=approved',
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      reasons = JSON.parse(body);
      console.log('Updated reason sober, found', reasons.length, 'reasons.');
    }
  }

  request(options, callback);
};

module.exports = {
  init: function(conf) {
    'use strict';
    config = conf;

    if (!config.TRIGGR_API_URL) {
      console.log('TRIGGR_API_URL config key missing, skipping reasonSober module');
      return false;
    }
    if (!config.TRIGGR_API_KEY) {
      console.log('TRIGGR_API_KEY config key missing, skipping reasonSober module');
      return false;
    }
    login(() => {
      setInterval(updateReasonSober, 5 * 60 * 1000);
      updateReasonSober();
    });
  },
  routes: function(app) {
    'use strict';
    app.get('/reasonSober', function(req, res) {
      res.send(reasons)
    });

    return app;
  },
  scripts: ['reasonSober/reasonSober.js'],
  directives: ['reason-sober'],
  stylesheets: ["reasonSober/reasonSober.css"]
};
