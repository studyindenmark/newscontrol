function NewsControl() {
    var self = this;

    self.init = function() {
        // Make sure we can log without breaking old browsers
        if (typeof(window.console) === 'undefined') {
            window.console = { 
                log: function() {}, 
                error: function(exception) { alert(exception); }
            };
        }
        
        // Handle unsuccessful requests
        $(document).ajaxError(function (e, r, ajaxOptions, thrownError) {
            switch (r.status) {
                case 403:
                    // Logged out
                    self.showLoginModal();
                    break;
                case 500:
                    // Server error
                    self.showErrorModal(r.responseText);
                    break;
            }
        });
    };

    self.showLoginModal = function() {
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    }

    self.showErrorModal = function(message) {
        $('#errorModal .message').text(message);
        $('#errorModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    }
}
