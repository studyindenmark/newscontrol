import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import InputFeed
from model import Entry

class NewsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets all entries from all feeds this user subscribes to"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        entries = Entry.all().ancestor(user)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        entries = [i.to_struct() for i in entries]
        
        self.response.out.write(json.dumps(entries))

app = webapp2.WSGIApplication([
    ('/news', NewsHandler),
], debug=True)
