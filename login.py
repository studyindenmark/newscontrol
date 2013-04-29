import webapp2
from google.appengine.ext.webapp import util
from google.appengine.api import users

class LoginHandler(webapp2.RequestHandler):
    def get(self):
        """Redirect to a URL with a Google sign in form"""
        self.redirect(users.create_login_url('/')),

app = webapp2.WSGIApplication([
    ('/login', LoginHandler),
], debug=True)
