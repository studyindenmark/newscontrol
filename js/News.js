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
        
        $(document).on('click', '#news .btn.publish', self.togglePublishedCallback);
        $(document).on('click', '#news .btn.unpublish', self.togglePublishedCallback);
        $(document).on('keydown', '#news input.tag', self.tagKeyDown);
        $(document).on('click', '#news .tags a.tag', self.untagEntry);
        $(document).on('click', '#news .entry .title', self.togglePost);
        
        $(document).on('change', '#news select.sorting-tags', self.loadSortedEntries);
        $(document).on('change', '#news select.sorting-language', self.loadSortedEntries);
        $(document).on('change', '#news select.sorting', self.loadSortedEntries);
        $(document).on('change', '#news select.sorting-order', self.loadSortedEntries);
        
        $(document).bind('me_loaded', function() {
            self.loadEntries();
        });
    };

    self.togglePost = function() {
        var $this = $(this),
            $container = $this.parents('li.entry');
        $container.toggleClass('maximized');
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
            $this.val('');
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

    self.loadSortedEntries = function() {
        var $this = $(this),
            $parent = $this.parents('.sort-filter'),
            $sorting = $parent.find('.sorting'),
            $sortingOrder = $parent.find('.sorting-order'),
            $sortingTags = $parent.find('.sorting-tags'),
            $sortingLanguage = $parent.find('.sorting-language'),
            order = $sorting.val().toLowerCase() + '-' + $sortingOrder.val().toLowerCase(),
            tag = $sortingTags.val().toLowerCase(),
            lang = $sortingLanguage.val().toLowerCase(),
            query = '?order=' + order;
        if (tag !== 'all tags') {
            query += '&tag=' + tag;
        }
        if (lang !== 'all languages') {
            query += '&lang=' + lang;
        }
        self.loadEntries(query);
    };
    
    self.loadEntries = function(query) {
        // Get tags so we can autocomplete them
        
        self.$ul.find('.entry').not('.template').remove();
        
        loadingBar.setPercent(10);
        
        $.getJSON('/tags').success(function(data) {
            loadingBar.setPercent(50);
            
            self.tagsList = [];
            $.each(data, function(i, item) {
                self.tagsList.push(item.title);
            });
            
            loadingBar.setPercent(60);

            HTML.createSortingTagsList(self.tagsList);
            loadingBar.setPercent(70);

            var url = '/news';
            if (query) {
                url += query;
            }
            $.getJSON(url).success(function(data) {
                var tags = JSON.stringify(self.tagsList);
                
                $.each(data, function(i, item) {
                    var $view = HTML.createEntry(item, tags);
                    self.$ul.append($view);
                });
                loadingBar.setPercent(100);
            });
        });
    };
}