import webapp2
import utils
import json
from google.appengine.ext.webapp import util
from google.appengine.api import users

class MeHandler(webapp2.RequestHandler):
    def get(self):
        """Redirect to a URL with a Google sign in form"""
        google_user = users.get_current_user()
        
        if not google_user:
            self.error(403)
            return
        
        user = utils.get_current_user_model()
        
        if user is None:
            if users.is_current_user_admin():
                user = utils.create_user(google_user)
            else:
                self.error(401)
                return
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(user.to_struct()))

app = webapp2.WSGIApplication([
    ('/me', MeHandler),
], debug=True)
