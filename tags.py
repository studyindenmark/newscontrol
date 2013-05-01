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
from model import Entry

import logging

class TagsHandler(webapp2.RequestHandler):
    def get(self):
        """Gets the tags for the logged in user"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        tags = Tag.all().ancestor(user)
            
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        
        tags = [i.to_struct() for i in tags]
        
        self.response.out.write(json.dumps(tags))
        
    def post(self):
        """Creates a new tag for the logged in user"""
        user = utils.get_current_user_model()
        title = self.request.get('title')
        new_title = self.request.get('newTitle') or None
        
        if not user:
            self.error(403)
            return
        
        if not title:
            self.error(400)

        # Create new tag
        if not new_title:
            m = Tag.all().ancestor(user).filter('title_lower =', title.lower()).get()
            
            if m:
                # Not unique
                self.error(409)
                return

            m = Tag(
                parent=user,
                title=title,
                title_lower=title.lower(),
            )
            m.put()

        # Rename Tag
        else:
            m = Tag.all().ancestor(user).filter('title_lower =', new_title.lower()).get()
            if m:
                # Not unique
                self.error(409)
                return

            m = Tag.all().ancestor(user).filter('title_lower =', title.lower()).get()
            if not m:
                # Original tag not found
                self.error(404)
                return

            m.title = new_title
            m.title_lower = new_title.lower()
            m.save()

        self.response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write('ok')

class DeleteTagsHandler(webapp2.RequestHandler):
    def delete(self, title):
        """Delete the specified tag for the current user"""
        user = utils.get_current_user_model()
        
        if not user:
            self.error(403)
            return
            
        m = Tag.all().ancestor(user).filter('title_lower =', title.lower()).get()
        if not m:
            # Original tag not found
            self.error(404)
            return

        entries = Entry.all().filter('tags =', m.key())

        # Remove tag from entries
        for entry in entries:
            logging.info(entry)
            entry.tags.remove(m.key())
            entry.save()
        
        m.delete()

        self.response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write('ok')

app = webapp2.WSGIApplication([
    ('/tags', TagsHandler),
    ('/tags/(.*)', DeleteTagsHandler),
], debug=True)
