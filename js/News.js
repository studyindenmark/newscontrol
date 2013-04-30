function News(newsControl) {
    var self = this;
    
    self.newsControl = newsControl;
    self.initialized = false;
    self.$view = $("#news");
    self.$ul = self.$view.find('> ul');
    self.tagsList = [];

    self.init = function() {
        self.initialized = true;
        self.loadFeeds();
        $(document).on('click', '#news .btn.publish', self.togglePublishedCallback);
        $(document).on('click', '#news .btn.unpublish', self.togglePublishedCallback);
    };
    
    self.togglePublishedCallback = function() {
        var $this = $(this), 
            $container = $this.parents('li.entry'),
            feedId = $container.data('feedId'),
            modelId = $container.data('modelId');
        
        var url = '/$USER_ID/feeds/$FEED_ID/entries/$ENTRY_ID';
        
        url = url.replace('$USER_ID', newsControl.user.id);
        url = url.replace('$FEED_ID', feedId);
        url = url.replace('$ENTRY_ID', modelId);
        
        var params = {
            published: $container.hasClass('published') ? 0 : 1,
        };
        
        $.post(url, params).success(function(data) {
            console.log('toggled publish for entry', data.published, data);
            if (data.published) {
                $container.addClass('published');
            } else {
                $container.removeClass('published');
            }
        });
    };
    
    self.loadFeeds = function() {
        // Get tags so we can autocomplete them
        $.getJSON('/tags').success(function(data) {
            $.each(data, function(i, item) {
                self.tagsList.push(item.title);
            });

            $.getJSON('/news').success(function(data) {
                console.log('news loaded', data);
                $.each(data, function(i, item) {
                    var $view = HTML.createEntry(item, JSON.stringify(self.tagsList));
                    self.$ul.append($view);
                });
            });
        });
    };
}