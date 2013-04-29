# feedparser doc
# http://pythonhosted.org/feedparser/basic.html

import os
import json
import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import Tag

class TagsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets the tags for the logged in user"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        tags = Tag.all().ancestor(user.key())
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        tags = [i.to_struct() for i in tags]
        
        self.response.out.write(json.dumps(tags))
        
    def post(self):
        """Creates a new tag for the logged in user"""
        user = utils.get_current_user_model()
        title = self.request.get('title')
        
        if not user:
            self.error(403)
            return
        
        if not title:
            self.error(400)

        m = Tag(
            parent=user.key(),
            title=title,
            title_lower=title.lower(),
        )
        m.put()
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write('ok')

app = webapp2.WSGIApplication([
    ('/tags', TagsHandler),
], debug=True)
