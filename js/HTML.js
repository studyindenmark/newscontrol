var HTML = {
    
    createFeed: function(data) {
        var $clone = $('.template.feed').clone(true);
        $clone.data('modelId', data.id);
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.feed-logo').attr('src', data.logo);
        $clone.find('.url').attr('href', data.url).text(data.url);
        $clone.find('select.language').val(data.language);
        return $clone;
    },
    
    createEntry: function(data, tags_autocomplete) {
        var $clone = $('.template.entry').clone(true),
            $input = $clone.find('input.tag');
        
        $clone.data('modelId', data.id);
        $clone.data('feedId', data.feed_id);
        $clone.data('link', data.link);
        
        $clone.removeClass('template');
        
        if (data.published) {
            $clone.addClass('published');
        }
        
        $clone.find('.mail').attr('href', 'mailto:user@example.com?Subject=' + encodeURIComponent(data.link));
        
        $clone.find('.title').text(data.title).append($('<span class="caret"></span>'));
        $clone.find('.content').html(data.content);
        $clone.find('.url').attr('href', data.url).text(data.url);
        $clone.find('.feed-logo').attr('src', data.feed_logo);
        $input.attr('data-source', tags_autocomplete);
        $.each(data.tags, function(index, item) {
            HTML.createInlineTag(item.title).insertBefore($input);
        });
        return $clone;
    },

    createTag: function(data, user_id) {
        var $clone = $('.template.tag').clone(true),
            link = '/'+ user_id + '/' + data.title + '.rss';
        $clone.removeClass('template');
        $clone.find('.title').text(data.title);
        $clone.find('.badge').text(data.entry_count);
        $clone.find('.feed-link').text(link).attr('href', link).attr('_target', 'top');
        return $clone;
    },

    createInlineTag: function(title) {
        return $('<a class="tag label label-info" href="javascript:void(0);">' + title + '</a>');
    },

    createSortingTagsList: function(tags) {
        var $sortingTags = $('#news select.sorting-tags'),
            selected = $sortingTags.val();
        console.log($sortingTags, tags);

        $sortingTags.html('');
        $('<option>All tags</option>').appendTo($sortingTags);

        $.each(tags, function(i, item) {
            $('<option>' + item + '</option>').appendTo($sortingTags);
        });
        $sortingTags.val(selected);
    }
    
};