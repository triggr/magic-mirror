'use strict';

var request = require('request');
request = request.defaults({jar: true});

let config = {};
let reasons = [];

const updateReasonSober = function(callback) {
  let options = {
    url: config.TRIGGR_API_URL + '/superUser/login',
    body: {email: config.TRIGGR_USERNAME, password: config.TRIGGR_PASSWORD},
    json: true,
    method: 'POST',
  }
  request(options, (error, response, body) => {
    let reasonSoberOptions = {
      url: config.TRIGGR_API_URL + '/superUser/reasonSober',
    };

    console.log('Updating reason sober', reasonSoberOptions);

    request(reasonSoberOptions, (error, response, body) => {
      if (error) {
        console.log("Updating reason sober API error: ", error);
        return;
      }
      if (response.statusCode === 200) {
        reasons = JSON.parse(body);
        console.log('Updated reason sober, found', reasons.length, 'reasons.');
      }
    });
  })
}

module.exports = {
  init: function(conf) {
    'use strict';
    config = conf;

    if (!config.TRIGGR_API_URL) {
      console.log('TRIGGR_API_URL config key missing, skipping reasonSober module');
      return false;
    }
    if (!config.TRIGGR_USERNAME || !config.TRIGGR_PASSWORD) {
      console.log('TRIGGR_USERNAME or TRIGGR_PASSWORD config key missing, skipping ' +
        'reasonSober module');
      return false;
    }
    setInterval(updateReasonSober, 5 * 60 * 1000);
    updateReasonSober();
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
