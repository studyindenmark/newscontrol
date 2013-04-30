var Modal = {
	showLogin: function() {
        $('#loginModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    },

    showError: function(message) {
        $('#errorModal .message').html(message);
        $('#errorModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    },

    showInformation: function(message) {
        $('#infoModal .message').html(message);
        $('#infoModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    }
};