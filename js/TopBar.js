function TopBar(newsControl) {
    var self = this;
    
    self.init = function() {
    };

    self.changeTab = function(tabName) {
        var $nav = $('.navbar-inner .nav.tabs'),
            $container = $('body > .container');
            
        $nav.find('> li').removeClass('active');
        $nav.find('.' + tabName).addClass('active');

        $container.children('div').hide();
        $container.children('#' + tabName).show();

        localStorage.lastTab = tabName;
    };
    
    if (localStorage.lastTab !== undefined) {
        self.changeTab(localStorage.lastTab);
    } else {
        self.changeTab('news');
    }
    
    $('.navbar .tabs li a').click(function(event) {
        event.preventDefault();
        
        var tabName = $(this).attr('rel');
        self.changeTab(tabName);
    });
    
    $('a.invite-user').click(function() {
        Modal.showInvite();
    });

}