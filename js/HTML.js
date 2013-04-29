var HTML = {
    
    createFeed: function(data) {
        var $clone = $('.template.feed').clone(true);
        $clone.find('.title').text(data.title);
        $clone.find('.url').attr('href', data.url).text(data.url);
        return $clone;
    },
    
};