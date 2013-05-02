import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import InputFeed
from model import Entry

import logging

class NewsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets all entries from all feeds this user subscribes to"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        entries = Entry.all().ancestor(user)

        order = self.request.get('order')
        logging.info(order)
        if order:
            if order == 'date-asc':
                entries = entries.order('time_published')
            elif order == 'date-desc':
                entries = entries.order('-time_published')
            elif order == 'title-asc':
                entries = entries.order('title')
            elif order == 'title-desc':
                entries = entries.order('-title')

        entries = entries.fetch(25)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        entries = [i.to_struct(include_tags=True) for i in entries]
        
        self.response.out.write(json.dumps(entries))

app = webapp2.WSGIApplication([
    ('/news', NewsHandler),
], debug=True)
