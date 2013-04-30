function News() {
    var self = this;
    
    self.initialized = false;
    self.$view = $("#news");
    self.$ul = self.$view.find('> ul');

    self.init = function() {
        self.initialized = true;
        self.loadFeeds();
    };
    
    self.loadFeeds = function() {
        $.getJSON('/news').success(function(data) {
            console.log('news loaded', data);
            $.each(data, function(i, item) {
                var $view = HTML.createEntry(item);
                self.$ul.append($view);
            });
        });
    };
}