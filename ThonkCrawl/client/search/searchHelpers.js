Template.search.events({
	/**
	 * handles the click event for the "go" button
	 * 
	 * @param  {Event} event       |the event object
	 * @param  {Template} template |the template the event occured in
	 */
	'click #searchGo' : function(event, template) {
		var target = event.target;
		var url =  $('#urlInput').val().trim();
		var terms =  $('#keyTerms').val().trim();
		if(typeof terms == '') {
			terms = "science";
		}

		//process the list
		terms = terms.split(',');
		console.log('searched: ' + url);
		var output = $('#output');
		var result = Crawler.search(url, terms);

		if(result.reason) {
				$('.alert').slideToggle();	
			setTimeout(function() {
				$('.alert').slideToggle();
			}, 2000);
		} else {
			$(output).html(result.reason + " <br />" + result.details);
		}		
	},
	/**
	 * TEMP FUNCTION - handles the click event for the 
	 * "Remove all files" button
	 */
	'click #removeAllFiles' : function() {
		Meteor.call("removeFiles");
	}
});