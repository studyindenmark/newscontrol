import webapp2
import json
import urllib
import datetime

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import InputFeed
from model import Entry

class FetchFeedsCronJob(webapp2.RequestHandler):
    def get(self):
        """Loop through all feeds and fetches their entries"""
        feeds = InputFeed.all().filter('deleted =', False)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        count = 0
        for feed in feeds:
            count += 1
            feed.fetch_entries(fetch_all=False)
        
        self.response.out.write(json.dumps({
            'nr_of_feeds_fetched': count,
        }))

app = webapp2.WSGIApplication([
    ('/cron/fetch_feeds', FetchFeedsCronJob),
], debug=True)
