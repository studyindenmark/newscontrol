function Feeds() {
    var self = this;

    self.initialized = false;

    self.init = function() {
        self.initialized = true;
    };
    
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

        $.post('/feeds', params).success(function(data) {
            console.log('feed added', data);
        });
    });
}