function NewsControl() {
    var self = this;

    self.init = function() {
        // Make sure we can log without breaking old browsers
        if (typeof(window.console) === 'undefined') {
            window.console = { 
                log: function() {}, 
                error: function(exception) { alert(exception); }
            };
        }
        
        // Handle unsuccessful requests
        $(document).ajaxError(function (e, r, ajaxOptions, thrownError) {
            switch (r.status) {
                case 403:
                    // Logged out
                    Modal.showLogin();
                    break;
                case 404:
                    Modal.showInformation('A resource cannot be found (' + ajaxOptions.url + ')');
                    break;
                case 409:
                    Modal.showInformation('The item is not unique.');
                    break;
                case 500:
                    // Server error
                    Modal.showError(r.responseText);
                    break;
            }
        });

        // Setup user, news, feeds and tags
        self.news = new News();
        self.feeds = new Feeds(self);
        self.tags = new Tags();
        self.user = new User();
        self.topBar = new TopBar(self);
    };
}
