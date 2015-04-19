from google.appengine.api import memcache

class clearmemcache:

  def GET(self):
    try:
      memcache.delete('flightdetailsdb')
      memcache.delete('pricesdb')
      memcache.delete('threedayflightdetailsdb')
      memcache.delete('threedaypricesdb')
      return 'OK'
    except:
      return 'error'

