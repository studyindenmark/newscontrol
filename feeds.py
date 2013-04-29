# feedbarser doc
# http://pythonhosted.org/feedparser/basic.html

import os
import json
import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import InputFeed

class FeedsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets the feeds for the logged in user"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        feeds = InputFeed.all().ancestor(user.key())
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        feeds = [i.to_struct() for i in feeds]
        
        self.response.out.write(json.dumps(feeds))
        
    def post(self):
        """Creates a new feed for the logged in user"""
        user = utils.get_current_user_model()
        url = self.request.get('url')
        
        feed = feedparser.parse(url)
        feed = feed['feed']
        
        id = feed['id']
        title = feed['title']
        content = feed['summary'] # Yes, summary.
        link = feed['link']
        
        if 'content' in feed:
            content = feed['content']['value']
            
        m = InputFeed(
            parent=user.key(),
            title=title,
            content=content,
            link=link,
        )
        
        m.put()

app = webapp2.WSGIApplication([
    ('/feeds', FeedsHandler),
], debug=True)
