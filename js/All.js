function All(newsControl) {
    var self = this;
    
    var loadingBar = newsControl.loadingBar;
    
    self.newsControl = newsControl;
    self.$view = $("#all");
    self.$ul = self.$view.find('> ul');
    self.tagsList = [];
    self.page = 0;
    self.loading = false;
    self.hasMore = true;

    self.init = function() {
    };
    
    self.load = function() {
        self.page = 0;
        self.hasMore = true;
        self.$ul.find('.entry').not('.template').remove();
        self.loadPage(0);
    };
    
    self.loadPage = function(page) {
        self.loading = true;
        loadingBar.setPercent(10);
        
        var url = '/all?page=' + page;

        $.getJSON(url).success(function(data) {
            $.each(data, function(i, item) {
                var $view = HTML.createEntry(item);
                self.$ul.append($view);
            });
            
            self.loading = false;
            loadingBar.setPercent(100);
            
            if (data.length === 0) {
                self.hasMore = false;
            }
        });
    };

    self.loadMore = function() {
        if (self.loading === true || !self.hasMore) {
            return;
        }
        
        self.page += 1;
        
        self.loadPage(self.page);
    };
    
    $(window).scroll(function() {
        var wt = $(window).scrollTop();    //* top of the window
        var wb = wt + $(window).height();  //* bottom of the window
    
        var ot = self.$ul.offset().top;  //* top of object (i.e. advertising div)
        var ob = ot + self.$ul.height(); //* bottom of object

        if (wb >= ob) {
            self.loadMore();
        }
    });
}