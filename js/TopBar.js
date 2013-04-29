function TopBar(newsControl) {
    var self = this;
    
    if (localStorage.lastTab !== undefined) {
        newsControl.changeTab(localStorage.lastTab);
    }
}