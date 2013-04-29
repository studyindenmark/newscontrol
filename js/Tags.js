function Tags() {
    var self = this;

	self.initialized = false;
    self.$view = $("#tags");
    self.$ul = self.$view.find('> ul');

    self.init = function() {
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

        self.initialized = true;
        self.loadTags();
    }

    self.loadTags = function() {
        $.getJSON('/tags').success(function(data) {
            console.log(data);
            
            $.each(data, function(i, item) {
                var $view = HTML.createTag(item);
                self.$ul.append($view);
            });
        });
    };
}