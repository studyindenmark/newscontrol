function TopBar(newsControl) {
    var self = this;

    self.changeTab = function(tabName) {
        var $nav = $('.navbar-inner .nav.tabs'),
            $container = $('body > .container');
        $nav.find('> li').removeClass('active');
        $nav.find('.' + tabName).addClass('active');

        $container.children('div').hide();
        $container.children('#' + tabName).show();

        switch(tabName) {
            case 'news':
                if (newsControl.news.initialized === false) {
                    newsControl.news.init();
                }
                break;
            case 'feeds':
                if (newsControl.feeds.initialized === false) {
                    newsControl.feeds.init();
                }
                break;
            case 'tags':
                if (newsControl.tags.initialized === false) {
                    newsControl.tags.init();
                }
                break;
            default:
                var e = 'TopBar.changeTab: Cannot initialize tab \"' + tabName + '\"';
                console.error(e);
                throw e;
        }
        
        localStorage.lastTab = tabName;
    };
    
    if (localStorage.lastTab !== undefined) {
        self.changeTab(localStorage.lastTab);
    }
    
    $('.navbar .tabs li a').click(function(event) {
        event.preventDefault();
        
        var tabName = $(this).attr('rel');
        self.changeTab(tabName);
    });
}