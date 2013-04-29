import webapp2
from google.appengine.ext.webapp import util
from google.appengine.api import users

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        """Redirect to a URL with a Google sign in form"""
        self.redirect(users.create_login_url('/')),

class LogoutHandler(webapp2.RequestHandler):
    def get(self):
        """Redirect to a URL that logs out the current Google User"""
        self.redirect(users.create_logout_url('/')),

app = webapp2.WSGIApplication([
    ('/login', LoginHandler),
    ('/logout', LogoutHandler),
], debug=True)
