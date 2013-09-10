import os
import json
import webapp2
import json
import urllib

import utils

from google.appengine.ext.webapp import template
from google.appengine.ext.webapp import util
from model import Tag
from model import Entry

import logging

class RSSHandler(webapp2.RequestHandler):
    def get(self, user, tag_title):
        """Gets RSS feed for a user, filtered by tag"""
        user = utils.get_user_model_by_id_or_nick(user)
        
        if not user:
            self.error(403)
            return
            
        tag_title = tag_title.decode('utf-8')
        tag = Tag.all().ancestor(user.key()).filter('title_lower =', tag_title.lower()).get()

        if not tag:
            self.error(404)
            return

        entries = Entry.all().filter('tags =', tag.key()).filter('published =', True).order('-time_published').fetch(20)
        entries = [e.to_struct() for e in entries]
            
        path = os.path.join(os.path.dirname(__file__), 'template.rss')
        self.response.headers['Content-Type'] = 'application/xml; charset=utf-8'
        self.response.out.write(template.render(path, {
            'entries': entries,
            'url': self.request.url,
            'title': tag_title,
        }))

app = webapp2.WSGIApplication([
    ('/(.*)/(.*)\.rss', RSSHandler),
], debug=True)
