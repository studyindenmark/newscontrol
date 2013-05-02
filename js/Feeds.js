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
        $(document).on('change', '#feeds select.language', self.setLanguageOnFeed);
        
        $(document).bind('me_loaded', function() {
            self.loadFeeds();
        });
        
        self.initialized = true;
    };

    self.setLanguageOnFeed = function() {
        var $this = $(this),
            $container = $this.parents('li.feed'),
            feedID = $container.data('modelId'),
            url = '/feeds/'+ feedID + '/languages/' + $this.val();

        loadingBar.setPercent(50)
        $.post(url).success(function(){
            loadingBar.setPercent(100);
        });
    };
    
    self.removeFeedCallback = function() {
        var $this = $(this), 
            $container = $this.parents('li.feed'),
            modelId = $container.data('modelId');
            
        console.log('removing', modelId);
        
        loadingBar.setPercent(10);
        
        $.ajax({
            type: 'DELETE',
            url: '/feeds/' + modelId,
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