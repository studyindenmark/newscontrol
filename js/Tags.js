function Tags() {
    var self = this;

	self.initialized = false;
    self.$view = $("#tags");
    self.$ul = self.$view.find('> ul');

    self.init = function() {
        $('#tags .btn.add').click(self.addTag);
        $('#tags .add input[name=title]')
            .keydown(self.titleKeyDown)
            .keyup(self.titleKeyUp);
        $(document).on('click', '#tags .tag .btn.edit', self.showEdit);
        $(document).on('click', '#tags .tag .btn.save', self.hideEdit);

        self.initialized = true;
        self.loadTags();
    };

    self.addTag = function() {
        var $title = $('#tags .add input[name=title]'),
            title = $title.val(),
            params = { title: title };
        
        if (!title) {
            alert('A name needs to be provided');
            return;
        }
        
        $.post('/tags', params).success(function(data) {
            $title.val('');
            var $view = HTML.createTag({
                title: title, 
                entry_count: 0
            });
            self.$ul.prepend($view);
        });
    };

    self.titleKeyDown = function(event) {
        if (typeof(event.keyCode) !== 'undefined') {
            // enter
            if (event.keyCode === 13) {
                self.addTag();
            }
        }
    };

    self.titleKeyUp = function(event) {
        if ($(this).val().length === 0) {
            $('#tags .btn.add').addClass('disabled').attr('disabled', true);
        } else {
            $('#tags .btn.add').removeClass('disabled').removeAttr('disabled');
        }
    };

    self.showEdit = function() {
        var $this = $(this), 
            $container = $this.parents('.tag.row'),
            title = $container.find('.title').text();
        $container.find('.title-edit').show();
        $container.find('input[name=title]').val(title);
        $container.find('.title-container, .btn.edit, .btn.remove').hide();
    };

    self.hideEdit = function() {
        var $this = $(this), 
            $container = $this.parents('.tag.row');
        $container.find('.title-edit').hide();
        $container.find('.title-container, .btn.edit, .btn.remove').show();
    };

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