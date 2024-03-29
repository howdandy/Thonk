Package.describe({
  name: 'averypfeiffer:files-ctrl',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'The files controller for thonk web crawler',
  // URL to the Git repository containing the source code for this package.
  git: 'N/A',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['ecmascript', 'mongo', 'jquery',
          'cfs:standard-packages', 'cfs:filesystem',
          'cfs:ejson-file','random','check']);
  api.use('underscore', 'client');
  //local packages
  api.addFiles('filectrl.js');
  api.export('FilesCtrl');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('filectrl');
  api.addFiles('filectrl-tests.js');
});
