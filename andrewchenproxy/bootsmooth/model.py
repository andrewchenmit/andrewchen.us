# bootsmooth
# model.py

import logging
import utility
from google.appengine.ext import db

# Smooth Model - bootsmooth database model
# - All models should use this as parent class
class Model(db.Model):

	# in convert dictionary to this
	def fromDict(self, data):
		for name, value in data.iteritems():
			n = name
			try:
				# ignore key
				if n == "key":
					logging.warning('skipping key')
					continue
				if n == "_key":
					logging.warning('skipping key')
					continue
				if n[:1] == '_':
					n = n[1:]
			except:
				pass
			setattr(self, n, value)
	
	# Returns Dictionary of data
	@staticmethod
	def toJSON(obj):
		try:
			objData = obj._entity
			objData['key'] = str(obj.key())
			return utility.json_dump(objData)
		except:
			return 0
	
	