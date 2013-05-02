import webapp2
import utils
import json
from google.appengine.ext.webapp import util

class MeHandler(webapp2.RequestHandler):
    def get(self):
        """Redirect to a URL with a Google sign in form"""
        user = utils.get_or_create_current_user()
        
        if not user:
            self.error(403)
            return
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(user.to_struct()))

app = webapp2.WSGIApplication([
    ('/me', MeHandler),
], debug=True)
