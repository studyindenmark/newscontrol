function Tags() {
    var self = this;

	self.initialized = false;

    self.init = function() {
        self.initialized = true;

        $('#tags .btn.add').click(function() {
        var $title = $('#tags .add input[name=title]'),
            title = $title.val();
        
        if (!title) {
            alert('A name needs to be provided');
            return;
        }
        
        var params = {
            title: title
        };

        $.post('/tags', params).success(function(data) {
            console.log('tag added', data);
        });
    });
    }
}