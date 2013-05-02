import json
import webapp2

from google.appengine.ext.webapp import util
from google.appengine.ext import db
from google.appengine.api import users

import mail

from model import InviteToken
import utils

class SignupHandler(webapp2.RequestHandler):
    def get(self):
        """Crete a new User using an InviteToken"""
        
        token = self.request.get('token')
        
        google_user = users.get_current_user()
        
        if not google_user:
            url = users.create_login_url('/signup?token=%s' % token)
            self.redirect(url)
            return
        
        if utils.get_current_user():
            # User is already logged in
            self.redirect('/')
            return
    
        m = InviteToken.all().filter('token =', token).get()
        
        if not m:
            self.error(404)
            return
        
        if m.user_signed_up:
            self.error(500)
            return
        
        new_user = utils.create_user(google_user)
        
        m.user_signed_up = new_user
        m.save()
        
        sender = db.get(m.sender)
        
        utils.copy_feeds_from_user(sender, new_user)
        
        self.redirect('/')
        
app = webapp2.WSGIApplication([
    ('/signup', SignupHandler),
], debug=True)
