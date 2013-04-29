from google.appengine.ext import db
from google.appengine.api import users
from time import mktime

class User(db.Model):
    google_user = db.UserProperty()
    nickname = db.StringProperty()
    nickname_lower = db.StringProperty()
    deleted = db.BooleanProperty(default=False)
    
    def fetch_feeds(self):
        return {}
    
    def to_struct(self):
        if self.deleted:
            return None
        else:
            return {
                'id': self.key().id(),
                'email': self.google_user.email(),
                'nickname': self.nickname
            }

class InviteToken(db.Model):
    email = db.StringProperty()
    token = db.StringProperty()

class InputFeed(db.Model):
    # parent(User)
    title = db.StringProperty()
    url = db.StringProperty()
    time_fetched = db.DateTimeProperty(auto_now_add=True)
    deleted = db.BooleanProperty()

    def fetch_entries(self):
        return []

    def to_struct(self):
        return {
            'title': self.title,
            'url': self.url,
            'time_fetched': mktime(self.time_fetched.timetuple()),
        }

class Entry(db.Model):
    #parent(InputFeed)
    id = db.StringProperty()
    title = db.StringProperty()
    content = db.TextProperty()
    link = db.TextProperty()
    time_published = db.DateTimeProperty()
    published = db.BooleanProperty()
    tags = db.ListProperty(db.Key)
    user = db.ReferenceProperty(reference_class=User)

    def to_struct(self, include_tags=False):
        tags = []
        if include_tags:
            for tag in db.get(self.tags):
                tags.append(tag.to_struct())
        
        return {
            'id': self.id,
            'title': self.title,
            'content': self.summary,
            'link': self.link,
            'time_published': mktime(self.time_published.timetuple()),
            'published': self.published,
            'tags': tags,
        }

class Tag(db.Model):
    #parent(User)
    title = db.StringProperty()
    title_lower = db.StringProperty()
    entry_count = db.IntegerProperty(default=0)
    entries = db.ListProperty(db.Key)

    def tag_entry(self, entry):
        self.entry_count += 1
        entry.tags.append(self.Key())
        entry.save()
        self.save()

    def to_struct(self, include_entries=False):
        entries = []
        if include_entries:
            for entry in entries:
                entries.append(entry.to_struct())

        return {
            'title': self.title,
            'entry_count': self.entry_count,
            'entries': entries,
        }
