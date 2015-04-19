import datetime
import MySQLdb
import os
import unicodedata
from bootsmooth import utility
from google.appengine.api import memcache

class flightdetailsdb:

  def GET(self):

    result = memcache.get('flightdetailsdb')
    if result is not None:
      return utility.json_dump(result)

    # Define your production Cloud SQL instance information.
    _INSTANCE_NAME = 'weekendairfare:fares'

    env = os.getenv('SERVER_SOFTWARE')
    if (env and env.startswith('Google App Engine/')):
      # Connecting from App Engine
      db = MySQLdb.connect(
             unix_socket='/cloudsql/weekendairfare:fares',
             user='root', passwd='roos', db='weekendfares')
    else:
      # Connecting from an external network.
      # Make sure your network is whitelisted
      db = MySQLdb.connect(
             '173.194.80.20',
             'root',
             "roos",
             "weekendfares")
    #db = MySQLdb.connect("173.194.80.20","root","roos","weekendfares")
    cursor=db.cursor()

    today = datetime.date.today()
    day = '{:02d}'.format(today.year) + '-' + '{:02d}'.format(today.month) + '-' + '{:02d}'.format(today.day)

    select_sql="""SELECT * FROM fares where latest = 1 and there_date > '%s'""" % (day)

    try:
      cursor.execute(select_sql)
    except MySQLdb.Error as e:
      print "db select error"
      print e

    rows = cursor.fetchall()
    columns = [t[0] for t in cursor.description]
    result = []

    for row in rows:
      newrow = []
      for item in row:
        #print item
        try:
          item = unicodedata.normalize('NFKD', item)
          #print item
        except:
          pass
        try:
          item = item.decode('utf-8','ignore')
          #print item
        except:
          pass
        try:
          item = unicodedata.normalize('NFKD', item)
          #print item
        except:
          pass
        #print item
        newrow.append(item)
      row = dict(zip(columns, newrow))
      result.append(row)

    result = eval(str(result))

    memcache.add('flightdetailsdb', result, 25200) # 7 hours.

    return utility.json_dump(result)
