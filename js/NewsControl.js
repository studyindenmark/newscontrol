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
                    self.showLoginModal();
                    break;
                case 500:
                    // Server error
                    self.showErrorModal(r.responseText);
                    break;
            }
        });

        // Setup user, news, feeds and tags
        self.news = new News();
        self.news.init();
        self.feeds = new Feeds();
        self.feeds.init();
        self.tags = new Tags();
        self.tags.init();
        self.user = new User();
        self.user.init();
    };

    self.showLoginModal = function() {
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    };

    self.showErrorModal = function(message) {
        $('#errorModal .message').text(message);
        $('#errorModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    };

    self.changeTab = function(tabName) {
        var $nav = $('.navbar-inner .nav.tabs'),
            $container = $('body > .container');
        $nav.find('> li').removeClass('active');
        $nav.find('.' + tabName).addClass('active');

        $container.children('div').hide();
        $container.children('#' + tabName).show();
    };
}
