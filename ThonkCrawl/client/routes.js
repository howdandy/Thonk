/** define the needed routes */
Router.route('/', {layoutTemplate: "crawler"},
    function() {
      this.redirect('/search');
});
Router.route('/search', {layoutTemplate: "crawler"},
  function() {
    this.render('search');
});