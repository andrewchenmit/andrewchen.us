import itertools
import json
import MySQLdb
import os
from bootsmooth import utility, render

class weekendfaresdb:

  def GET(self):

    # Define your production Cloud SQL instance information.
    _INSTANCE_NAME = 'weekendairfare:fares'

    db = MySQLdb.connect("173.194.80.20","root","roos","weekendfares")
    cursor=db.cursor()

    select_sql="""SELECT * FROM fares"""

    try:
      cursor.execute(select_sql)
    except MySQLdb.Error as e:
      print "db select error"
      print e

    rows = cursor.fetchall()
    #print rows
    columns = [t[0] for t in cursor.description]
    result = []

    for row in rows:
      row = dict(zip(columns, row))
      result.append(row)

    result = eval(str(result))
    return utility.json_dump(result)
    #return render.page('/www/travelroos/index.html')
