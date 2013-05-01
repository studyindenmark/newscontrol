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
from google.appengine.api import users

from model import InputFeed
from model import User

class SpecificFeedHandler(webapp2.RequestHandler):
    def delete(self, user_id, model_id):
        """Deletes a specific feed"""
        current_user = utils.get_current_user_model()
        
        if not current_user:
            self.error(403)
            return
        
        user = User.get_by_id(int(user_id))
        
        if user == None:
            self.error(404)
            return
        
        if current_user != user and not users.is_current_user_admin():
            self.error(401)
            return
        
        m = InputFeed.get_by_id(int(model_id), parent=user)
        
        if m == None:
            self.error(404)
            return
        
        m.deleted = True
        m.save()
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        #self.response.out.write(json.dumps(m.to_struct()))
        self.response.out.write(json.dumps({
            'id': model_id,
        }))

class FeedsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets the feeds for the logged in user"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        feeds = InputFeed.all().ancestor(user).filter('deleted =', False)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        feeds = [i.to_struct() for i in feeds]
        
        self.response.out.write(json.dumps(feeds))
        
    def post(self):
        """Creates a new feed for the logged in user"""
        user = utils.get_current_user_model()
        url = self.request.get('url')
        
        if not user:
            self.error(403)
            return
        
        feed = feedparser.parse(url)
        feed = feed.get('feed')
        
        id = feed.get('id')
        logo = feed.get('gd_image', {}).get('src')
        title = feed.get('title')
        content = feed.get('summary') # Yes, summary.
        link = feed.get('link')
        
        if 'content' in feed:
            content = feed.get('content').get('value')
            
        m = InputFeed(
            parent=user,
            logo=logo,
            url=url,
            title=title,
            content=content,
            link=link,
        )
        
        m.put()
        m.fetch_entries(fetch_all=True)
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(m.to_struct()))

app = webapp2.WSGIApplication([
    ('/(.*)/feeds/(.*)', SpecificFeedHandler),
    ('/feeds', FeedsHandler),
], debug=True)
