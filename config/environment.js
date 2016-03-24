/* jshint node: true */

module.exports = function(environment) {
  environment = environment;
  var ENV = {
    modulePrefix: 'exalt',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    firebase: 'https://exaltly.firebaseio.com/',
    stripePublishableKey:'pk_test_y4bKvdM03OKfJpFXvLzKm8Ax',
    stripePlanId:'023232458',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'font-src': "'self' data: fonts.gstatic.com",
      'style-src': "'self' 'unsafe-inline' fonts.googleapis.com",
      'connect-src': "'self' https://auth.firebase.com wss://*.firebaseio.com",
      'frame-src': "'self' https://*.firebaseio.com https://*.stripe.com/",
      'script-src': "'self' 'unsafe-eval' https://*.firebaseio.com https://*.stripe.com/"
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
