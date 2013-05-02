import webapp2
import json

from google.appengine.api import users
from google.appengine.ext.webapp import util

import utils

class MeHandler(webapp2.RequestHandler):
    def get(self):
        """ Return info about current logged in user
        
        Automatically create internal user models for admin google users.
        """
        user = utils.get_current_user()
        
        if not user:
            google_user = users.get_current_user()
            
            if not google_user:
                self.error(403)
                return
            
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
