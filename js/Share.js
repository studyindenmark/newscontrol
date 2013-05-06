function Share() {
    var self = this;

    self.init = function() {
        $(document).on('click', '.share .twitter', self.twitter);
        $(document).on('click', '.share .facebook', self.facebook);
    };
        
    self.twitter = function() {
        var $entry = $(this).parents('.entry');
        var entryUrl = $entry.data('link');
        var entryTitle = $entry.find('.title').text();
        var url = encodeURI('http://twitter.com/share?related=studyindenmark&via=studyindenmark' + '&url=' + entryUrl  + '&counturl=' + entryUrl + '&text=' + entryTitle);
        window.open(url, 'Share on Twitter', 'width=500, height=300');
        return false;
    };
    
    self.facebook = function() {
        var $entry = $(this).parents('.entry');
        var entryUrl = $entry.data('link');
        var url = 'http://facebook.com/sharer.php?u=' + entryUrl;
        window.open(url, 'Share on Facebook', 'width=500, height=300');
        return false;
    };
}