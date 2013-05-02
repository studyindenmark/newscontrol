function Feeds(newsControl) {
    var self = this;
    
    var loadingBar = newsControl.loadingBar;
    
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
            
            loadingBar.setPercent(10);

            $.post('/feeds', params).success(function(data) {
                console.log('feed added', data);
                var $view = HTML.createFeed(data);
                self.$ul.append($view);
            }).complete(function() {
                loadingBar.setPercent(100);
                newsControl.news.loadEntries();
            });
        });
        
        $(document).on('click', '#feeds .btn.remove', self.removeFeedCallback);
        
        self.loadFeeds();
        self.initialized = true;
    };
    
    self.removeFeedCallback = function() {
        var $this = $(this), 
            $container = $this.parents('li.feed'),
            modelId = $container.data('modelId');
            
        console.log('removing', modelId);
        
        loadingBar.setPercent(10);
        
        $.ajax({
            type: 'DELETE',
            url: '/' + newsControl.user.id + '/feeds/' + modelId,
            statusCode: {
                200: function(data) {
                    console.log('feed removed', data);
                    $container.fadeOut();
                    newsControl.news.loadEntries();
                }
            },
            complete: function() {
                loadingBar.setPercent(100);
            }
        });
    };
    
    self.loadFeeds = function() {
        $.getJSON('/feeds').success(function(data) {
            console.log('feeds fetched', data);
            $.each(data, function(i, item) {
                var $view = HTML.createFeed(item);
                self.$ul.append($view);
            });
        });
    };
}