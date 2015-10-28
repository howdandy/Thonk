Package.describe({
  name: 'averypfeiffer:page-parser',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['ecmascript', 'mongo', 'check', 'anonyfox:scrape', 'deps', 'jquery']);
  api.use('underscore', 'client');
  api.addFiles('lib/Page/_base/Page.js');
  api.addFiles('lib/PageParser/_base/PageParser.js');
  api.addFiles('lib/PageParser/ParserFactory.js');
  api.addFiles('lib/PageParser/RSSParser.js');
  api.addFiles('lib/PageParser/WikiParser.js');
  api.addFiles('lib/PageParser/WebsiteParser.js');
  api.export(['PageParser', 'Page', 'ParserFactory']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('averypfeiffer:page-parser');
  api.addFiles('page-parser-tests.js');
});
