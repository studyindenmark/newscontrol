var HTML = {
    
    createFeed: function(data) {
        var $clone = $('.template.feed').clone(true);
        $clone.data('modelId', data.id);
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.url').attr('href', data.url).text(data.url);
        return $clone;
    },
    
    createEntry: function(data, tags_autocomplete) {
        var $clone = $('.template.entry').clone(true);
        
        $clone.data('modelId', data.id);
        $clone.data('feedId', data.feed_id);
        
        $clone.removeClass('template');
        
        if (data.published) {
            $clone.addClass('published');
        }
        
        $clone.find('.title').text(data.title);
        $clone.find('.content').html(data.content);
        $clone.find('.url').attr('href', data.url).text(data.url);
        $clone.find('.feed-logo').attr('src', data.feed_logo);
        $clone.find('input.tag').attr('data-source', tags_autocomplete);
        return $clone;
    },

    createTag: function(data) {
        var $clone = $('.template.tag').clone(true);
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.badge').text(data.entry_count);
        return $clone;
    }
    
};