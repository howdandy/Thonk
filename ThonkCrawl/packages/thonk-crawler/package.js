Package.describe({
  name: 'averypfeiffer:thonk-crawler',
  version: '0.0.1',
  summary: 'A crawler for the Thonk App',
  git: 'N/A',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.2');
  api.use(['ecmascript',
           'templating',
           'mongo',
           'iron:router',
           'jquery',
           'deps',
           'cfs:standard-packages',
           'cfs:filesystem',
           'random',
           'cfs:ejson-file',
           'http',
           'check',
           'aldeed:simple-schema']);
  Npm.depends({'cheerio' : '0.19.0', 'chalk' : '1.1.1', 'fibers' : '1.0.7'});
  api.use('handlebars', 'client');
  api.use('underscore', 'client');
  //local packages
  api.use(['averypfeiffer:files-ctrl', 'averypfeiffer:database-ctrl', 'averypfeiffer:page-parser']);
  api.addFiles('lib/Objects/Crawler.js');
  api.addFiles('server/methods.js', 'server');
  api.addFiles('server/crawler/Crawler.js', 'server');
  api.addFiles('client/crawler/Crawler.js', 'client');
  api.addFiles('thonk-crawler.js');
  api.export('Crawler');
});

Package.onTest(function(api) {
  api.use(['ecmascript','tinytest', 'test-helpers', 'crawler']);
  api.addFiles('thonk-crawler-tests.js', ['client', 'server']);
});
