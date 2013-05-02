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

import logging

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
        
        feed = InputFeed.get_by_id(int(feed_id), parent=user)
        
        if feed == None:
            self.error(404)
            return
        
        entry = Entry.get_by_id(int(entry_id), parent=feed)
        
        published = self.request.get('published')
        
        if published != None:
            entry.published = bool(int(published))
            entry.save()
        
        self.response.headers['Content-Type'] = 'application/json; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write(json.dumps(entry.to_struct()))

class TagEntryHandler(webapp2.RequestHandler):
    def post(self, feed_id, entry_id, tag_title):
        current_user = utils.get_current_user_model()
        
        if not current_user:
            logging.info('no user logged in')
            self.error(403)
            return

        logging.info(feed_id)
        feed = InputFeed.get_by_id(int(feed_id), parent=current_user)

        if not feed:
            logging.info('no feed found')
            self.error(404)
            return

        entry = Entry.get_by_id(int(entry_id), parent=feed)

        if not entry:
            logging.info('no entry found')
            self.error(404)
            return

        if not tag_title:
            logging.info('no tag_title provided found')
            self.error(400)

        tag = Tag.all().ancestor(current_user).filter('title_lower =', tag_title.lower()).get()

        if not tag:
            logging.info('tag not found, creating new')

            tag = Tag(
                parent=current_user,
                title=tag_title,
                title_lower=tag_title.lower(),
            )

        tag.tag_entry(entry)
        self.response.headers['Content-Type'] = 'text/plain; charset=utf-8'
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.out.write('ok')

app = webapp2.WSGIApplication([
    ('/(.*)/feeds/(.*)/entries/(.*)', SpecificEntryHandler),
    ('/feeds/(.*)/entries/(.*)/tags/(.*)', TagEntryHandler),
], debug=True)
