function NewsControl() {
    var self = this,
        user = null;

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

        // Setup news, feeds and tags
        self.news = new News();
        self.feeds = new Feeds();
        self.tags = new Tags();
        self.news.init();
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

        switch(tabName) {
            case 'news':
                if (self.news.initialized === false) {
                    self.news.init();
                }
                break;
            case 'feeds':
                if (self.feeds.initialized === false) {
                    self.feeds.init();
                }
                break;
            case 'tags':
                if (self.tags.initialized === false) {
                    self.tags.init();
                }
                break;
            default:
                var e = 'NewsControl.changeTab: Cannot initialize tab \"' + tabName + '\"';
                console.error(e);
                throw e;
        }
    };
}
