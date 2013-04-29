function Feeds() {
    var self = this;
    
    self.initialized = false;
    self.$view = $("#feeds");
    self.$ul = self.$view.find('> ul');

    self.init = function() {
        $('#feeds .btn.add').click(function() {
            var $url = $('#feeds .add input[name=url]');
            var url = $url.val();
            
            if (!url) {
                alert('A URL needs to be provided');
                return;
            }
            
            var params = {
                url: url
            };

            $.post('/feeds', params).success(function(data) {
                console.log('feed added', data);
            });
        });
        
        self.loadFeeds();
        self.initialized = true;
    };
    
    self.loadFeeds = function() {
        $.getJSON('/feeds').success(function(data) {
            $.each(data, function(i, item) {
                var $view = HTML.createFeed(item);
                self.$ul.append($view);
            });
        });
    };
}