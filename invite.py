import json
import webapp2
import uuid

from google.appengine.ext.webapp import util
from google.appengine.api import users

import mail

from model import InviteToken

class InviteHandler(webapp2.RequestHandler):
    def post(self):
        """Send an invitation mail to the provided email address"""
        
        email = self.request.get('email')
        token = uuid.uuid1().hex
        
        mail.send_invite_email(email, token)
    
        m = InviteToken(
            email=email,
            token=token
        )
        m.put()
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps({
            'message': 'An invitation email was sent to %s' % email,
            'email': email,
            'token': token,
        }))

app = webapp2.WSGIApplication([
    ('/invite', InviteHandler),
], debug=True)
