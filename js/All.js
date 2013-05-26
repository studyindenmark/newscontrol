function All(newsControl) {
    var self = this;
    
    var loadingBar = newsControl.loadingBar;
    
    self.newsControl = newsControl;
    self.$view = $("#all");
    self.$ul = self.$view.find('> ul');
    self.tagsList = [];

    self.init = function() {
    };
    
    self.load = function() {
        loadingBar.setPercent(10);
        
        self.$ul.find('.entry').not('.template').remove();
        
        var url = '/all';

        $.getJSON(url).success(function(data) {
            console.log(data)
            $.each(data, function(i, item) {
                var $view = HTML.createEntry(item);
                self.$ul.append($view);
            });
            loadingBar.setPercent(100);
        });
    };
}