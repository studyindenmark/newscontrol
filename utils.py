from google.appengine.api import users
from google.appengine.ext import db

from model import User

latest_signup = None

@db.transactional
def create_user(google_user):
    global latest_signup
    user = User(
        google_user=google_user
    )
    user.put()
    latest_signup = user
    return user

def get_current_user():
    google_user = users.get_current_user()
    
    if latest_signup != None and google_user == latest_signup.google_user:
        return latest_signup
        
    user = get_user_model_for(google_user)
    return user

def get_user_model_for(google_user=None):
    return User.all().filter('google_user =', google_user).get()

def get_user_model_by_id_or_nick(id_or_nick):
    if id_or_nick.isdigit():
        return User.get_by_id(int(id_or_nick))
    else:
        return User.all().filter('nickname_lower = ', id_or_nick.lower()).get()
    
def copy_feeds_from_user(user1, user2):
    """Copy subscriptions from user1 to user2"""
    for feed in InputFeed.all().ancestor(user1):
        new_feed = clone_entity(feed, parent=user2)
        new_feed.put()
        
        # TODO: this does not scale
        new_feed.fetch_entries()
        
# from http://stackoverflow.com/a/2712401/80880
def clone_entity(e, **extra_args):
  """Clones an entity, adding or overriding constructor attributes.

  The cloned entity will have exactly the same property values as the original
  entity, except where overridden. By default it will have no parent entity or
  key name, unless supplied.

  Args:
    e: The entity to clone
    extra_args: Keyword arguments to override from the cloned entity and pass
      to the constructor.
  Returns:
    A cloned, possibly modified, copy of entity e.
  """
  klass = e.__class__
  props = dict((k, v.__get__(e, klass)) for k, v in klass.properties().iteritems())
  props.update(extra_args)
  return klass(**props)