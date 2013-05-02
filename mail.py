import logging
from string import Template

from google.appengine.api import mail
from google.appengine.ext import webapp
from google.appengine.ext.webapp import util

from config import DOMAIN
from config import MAIL_SENDER

# GAE developer doc: https://developers.google.com/appengine/docs/python/mail/

INVITATION_TEMPLATE =  """
You have been invited to to News Control.

$link

Best regards,
The News Control team
"""

def send_invite_email(email, token):
    """ <email> has been invited to News Control """
    
    body = Template(INVITATION_TEMPLATE).substitute({
        'email': email,
        'link': 'http://' + DOMAIN + '/signup?token=%s' % token
    })

    subject="News Control Invite"

    logging.info(body)
    
    mail.send_mail(sender=MAIL_SENDER,
                  to=email,
                  subject=subject,
                  body=body)
