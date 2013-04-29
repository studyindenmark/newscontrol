function User() {
    var self = this;
    
    self.id = null;
    self.nickname = null;
    
    self.init = function() {
        $.getJSON('/me').success(function(data) {
            console.log('user loaded', data);
            self.id = data.id;
            self.nickname = data.nickname;
        });
    };
}