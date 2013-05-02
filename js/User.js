function User() {
    var self = this;
    
    self.id = null;
    self.nickname = null;
    self.email = null;
    
    $.getJSON('/me').success(function(data) {
        console.log('user loaded', data);
        self.id = data.id;
        self.nickname = data.nickname;
        self.email = data.email;
        $('.dropdown.user .username').text(self.email);
        $('.dropdown.user').show();
        
        $(document).trigger('me_loaded');
    });
}