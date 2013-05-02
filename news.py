import webapp2
import json
import urllib

import feedparser
import utils

from google.appengine.ext.webapp import util
from model import InputFeed
from model import Entry
from model import Tag

import logging

class NewsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets all entries from all feeds this user subscribes to"""
        user = utils.get_or_create_current_user()
        
        if not user:
            self.error(403)
            return
            
        # Filter and sorting
        order = self.request.get('order')
        lang = self.request.get('lang')
        tag_title = self.request.get('tag')

        # Filter
        if tag_title:
            tag = Tag.all().ancestor(user.key()).filter('title_lower =', tag_title.lower()).get()
            entries = Entry.all().filter('tags =', tag.key())
        else:
            entries = Entry.all().ancestor(user)

        if lang and lang != 'all':
            entries = entries.filter('language =', lang)

        # Sorting
        if order:
            if order == 'date-asc':
                entries = entries.order('time_published')
            elif order == 'date-desc':
                entries = entries.order('-time_published')
            elif order == 'title-asc':
                entries = entries.order('title')
            elif order == 'title-desc':
                entries = entries.order('-title')
        else:
            entries = entries.order('-time_published')

        entries = entries.fetch(25)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        entries = [i.to_struct(include_tags=True) for i in entries]
        
        self.response.out.write(json.dumps(entries))

app = webapp2.WSGIApplication([
    ('/news', NewsHandler),
], debug=True)
