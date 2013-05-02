import json
import webapp2

from google.appengine.ext.webapp import util
from google.appengine.api import users

import mail

from model import InviteToken
import utils

class SignupHandler(webapp2.RequestHandler):
    def get(self):
        """Crete a new User using an InviteToken"""
        
        if not users.get_current_user():
            url = users.create_login_url()
            self.redirect(url)
            return
        
        if utils.get_current_user():
            # User is already logged in
            self.redirect('/')
            return
        
        token = self.request.get('token')
    
        m = InviteToken.all().filter('token =', token).get()
        
        if not m:
            self.error(404)
            return
        
        if m.user_signed_up:
            self.error(500)
            return
        
        m.user_signed_up = utils.create_user(users.get_current_user())
        m.save()
        
        self.redirect('/')
        
app = webapp2.WSGIApplication([
    ('/signup', SignupHandler),
], debug=True)
