var Modal = {
    
    init: function(newsControl) {
        $('#inviteModal .btn-primary').click(function(event) {
            var email = $('#inviteModal input[name=email]').val();
            
            if (!email || email.indexOf('@') === -1 || email.indexOf('.') == -1) {
                alert('An valid email must be provided')
                event.preventDefault();
                
                // TODO: don't close modal
                
                return;
            }
            
            var params = {
                email: email
            };
            
            newsControl.loadingBar.setPercent(10);
            console.log('inviting', email);
            
            $.post('/invite', params).success(function(data) {
                console.log('user invited', data);
            }).complete(function() {
                newsControl.loadingBar.setPercent(100);
            });
        });
    },
    
	showInvite: function() {
        $('#inviteModal').modal({
            backdrop: 'static',
            keyboard: true,
            show: true
        });
    },
    
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