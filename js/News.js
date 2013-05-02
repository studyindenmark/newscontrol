function News(newsControl) {
    var self = this;
    
    var loadingBar = newsControl.loadingBar;
    
    self.newsControl = newsControl;
    self.initialized = false;
    self.$view = $("#news");
    self.$ul = self.$view.find('> ul');
    self.tagsList = [];

    self.init = function() {
        self.initialized = true;
        self.loadEntries();
        $(document).on('click', '#news .btn.publish', self.togglePublishedCallback);
        $(document).on('click', '#news .btn.unpublish', self.togglePublishedCallback);
        $(document).on('keydown', '#news input.tag', self.tagKeyDown);
        $(document).on('click', '#news .tags a.tag', self.untagEntry);
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

    self.tagKeyDown = function(event) {
        if (typeof(event.keyCode) !== 'undefined') {
            // enter
            if (event.keyCode === 13) {
                self.tagEntry($(this));
            }
        }
    };

    self.tagEntry = function(elem) {
        var $this = typeof(elem) === 'undefined' ? $(this) : elem,  
            $container = $this.parents('li.entry'),
            feedId = $container.data('feedId'),
            modelId = $container.data('modelId'),
            tag_title = $container.find('input.tag').val();
        
        var url = '/feeds/$FEED_ID/entries/$ENTRY_ID/tags/$TAG_TITLE';
        
        url = url.replace('$FEED_ID', feedId);
        url = url.replace('$ENTRY_ID', modelId);
        url = url.replace('$TAG_TITLE', tag_title);
        
        $.post(url).success(function(data) {
            console.log('Tagged entry', modelId, tag_title, data);
            HTML.createInlineTag(tag_title).insertBefore($container.find('input.tag'));
        });
    };

    self.untagEntry = function(elem) {
        var $this = $(this),
            $container = $this.parents('li.entry'),
            feedId = $container.data('feedId'),
            modelId = $container.data('modelId'),
            tag_title = $this.text();
        
        var url = '/feeds/$FEED_ID/entries/$ENTRY_ID/tags/$TAG_TITLE';
        
        url = url.replace('$FEED_ID', feedId);
        url = url.replace('$ENTRY_ID', modelId);
        url = url.replace('$TAG_TITLE', tag_title);
        
        $.ajax({
            type: 'DELETE',
            url: url
        }).success(function(data) {
            console.log('Tagged entry', modelId, tag_title, data);
            $this.remove();
        });
    };
    
    self.loadEntries = function() {
        // Get tags so we can autocomplete them
        
        self.$ul.find('.entry').not('.template').remove();
        
        loadingBar.setPercent(10);
        
        $.getJSON('/tags').success(function(data) {
            loadingBar.setPercent(50);
            
            $.each(data, function(i, item) {
                self.tagsList.push(item.title);
            });

            $.getJSON('/news').success(function(data) {
                loadingBar.setPercent(100);
                
                console.log('news loaded', data);
                
                $.each(data, function(i, item) {
                    var $view = HTML.createEntry(item, JSON.stringify(self.tagsList));
                    self.$ul.append($view);
                });
            });
        });
    };
}