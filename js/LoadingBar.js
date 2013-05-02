function LoadingBar() {
    var self = this;
    
    self.$view = $('.loading-bar');
    self.$bar = $('.loading-bar .bar');
    
    self.setPercent = function(percent) {
        self.$view.fadeIn();
        
        self.$bar.css('width', percent + '%');
        
        if (percent === 100) {
            self.$view.fadeOut();
        }
    };
}