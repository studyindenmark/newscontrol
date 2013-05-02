function Tags(newsControl) {
    var self = this;

    self.newsControl = newsControl;
	self.initialized = false;
    self.$view = $("#tags");
    self.$ul = self.$view.find('> ul');

    self.init = function() {
        $('#tags .btn.add').click(self.addTag);
        $('#tags .add input[name=title]')
            .keydown(self.titleKeyDown)
            .keyup(self.titleKeyUp);
        $(document).on('click', '#tags .tag .btn.edit', self.showEdit);
        $(document).on('click', '#tags .tag .btn.save', self.renameTag);
        $(document).on('click', '#tags .tag .btn.delete', self.deleteTag);

        self.initialized = true;
        
        $(document).bind('me_loaded', function() {
            self.loadTags();
        });
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
        $container.find('input[name=title]').val(title).focus();
        $container.find('.title-container, .btn.edit, .btn.delete').hide();
    };

    self.hideEdit = function(elem) {
        var $this = typeof(elem) === 'undefined' ? $(this) : elem, 
            $container = $this.parents('.tag.row');
        $container.find('.title-edit').hide();
        $container.find('.title-container, .btn.edit, .btn.delete').show();
    };

    self.renameTag = function() {
        var $this = $(this), 
            $container = $this.parents('.tag.row'),
            title = $container.find('.title').text(),
            newTitle = $container.find('input[name=title]').val(),
            params = { title: title, newTitle: newTitle };
        
        // Don't send update request if no name change
        if (newTitle === title) {
            self.hideEdit($this);
            return;
        }

        $.post('/tags', params).success(function(data, status) {
            console.log(data, status);
            $container.find('.title').text(newTitle);
            self.hideEdit($this);
        });

    };

    self.deleteTag = function() {
        var $this = $(this), 
            $container = $this.parents('.tag.row'),
            title = $container.find('.title').text();

        $.ajax({
            url: '/tags/' + title,
            type: 'DELETE'
        }).success(function(data, status) {
            console.log(data, status);
            $container.remove();
        });

    };

    self.loadTags = function() {
        $.getJSON('/tags').success(function(data) {
            $.each(data, function(i, item) {
                var $view = HTML.createTag(item, newsControl.user.id);
                self.$ul.append($view);
            });
        });
    };
}