import os
import json
import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from google.appengine.api import users

from model import InputFeed
from model import Entry
from model import User

class SpecificEntryHandler(webapp2.RequestHandler):
    def post(self, user_id, feed_id, entry_id):
        """Updates a specific entry"""
        current_user = utils.get_current_user_model()
        
        if not current_user:
            self.error(403)
            return
        
        user = User.get_by_id(int(user_id))
        
        if user == None:
            self.error(404)
            return
        
        if current_user.key() != user.key():
            self.error(401)
            return
        
        feed = InputFeed.get_by_id(int(feed_id), parent=user.key())
        
        if feed == None:
            self.error(404)
            return
        
        entry = Entry.get_by_id(int(entry_id), parent=feed.key())
        
        published = self.request.get('published')
        
        if published != None:
            entry.published = bool(published)
            entry.save()
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(entry.to_struct()))

app = webapp2.WSGIApplication([
    ('/(.*)/feeds/(.*)/entries/(.*)', SpecificEntryHandler),
], debug=True)
