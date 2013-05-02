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
from model import Entry

import logging

class SpecificFeedHandler(webapp2.RequestHandler):
    def delete(self, model_id):
        """Deletes a specific feed"""
        current_user = utils.get_current_user()
        
        if not current_user:
            self.error(403)
            return
        
        m = InputFeed.get_by_id(int(model_id), parent=current_user)
        
        if not m:
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
        user = utils.get_current_user()
        
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
        user = utils.get_current_user()
        url = self.request.get('url')
        
        if not user:
            self.error(403)
            return
        
        feed = feedparser.parse(url)
        feed = feed.get('feed')
        
        id = feed.get('id')
        logo = feed.get('gd_image', {'src': '/img/rss-placeholder.png'}).get('src')
        title = feed.get('title')
        link = feed.get('link')
        
        m = InputFeed(
            parent=user,
            logo=logo,
            url=url,
            title=title,
            link=link,
        )
        
        m.put()
        m.fetch_entries(fetch_all=True)
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(m.to_struct()))

class LanguageFeedHandler(webapp2.RequestHandler):
    def post(self, feed_id, language):
        current_user = utils.get_current_user()
        
        if not current_user:
            self.error(403)
            return
        
        feed = InputFeed.get_by_id(int(feed_id), parent=current_user)
        
        if not feed:
            self.error(404)
            return

        entries = Entry.all().ancestor(feed)
        for entry in entries:
            entry.language = language
            entry.save()

        feed.language = language
        feed.save()

        self.response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write('ok')

app = webapp2.WSGIApplication([
    ('/feeds/(.*)/languages/(.*)', LanguageFeedHandler),
    ('/feeds/(.*)', SpecificFeedHandler),
    ('/feeds', FeedsHandler),
], debug=True)
