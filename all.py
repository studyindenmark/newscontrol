import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from google.appengine.api import users
from model import InputFeed
from model import Entry
from model import Tag

import logging

class AllHandler(webapp2.RequestHandler):
    def get(self):
        """Gets all entries"""
        if not users.is_current_user_admin():
            self.error(401)
            return
            
        entries = Entry.all().order('-time_published').fetch(50)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        entries = [i.to_struct(include_tags=True) for i in entries]
        
        self.response.out.write(json.dumps(entries))

app = webapp2.WSGIApplication([
    ('/all', AllHandler),
], debug=True)
