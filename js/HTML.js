var HTML = {
    
    createFeed: function(data) {
        var $clone = $('.template.feed').clone(true);
        $clone.data('modelId', data.id);
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.url').attr('href', data.url).text(data.url);
        return $clone;
    },
    
    createEntry: function(data) {
        var $clone = $('.template.news').clone(true);
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.url').attr('href', data.url).text(data.url);
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