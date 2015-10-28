Package.describe({
  name: 'averypfeiffer:database-ctrl',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'The database controller for Thonk web crawler',
  // URL to the Git repository containing the source code for this package.
  git: 'N/A',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['ecmascript', 'mongo', 'jquery', 'check']);
  api.use('underscore', 'client');
  //local packages
  api.addFiles('databasectrl.js');
  api.export('DatabaseCtrl');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('databasectrl');
  api.addFiles('databasectrl-tests.js');
});
