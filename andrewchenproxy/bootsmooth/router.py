# bootsmooth utility module
# router.py

from utility import *

# URL Mapping

import logging

urlmap = [
	'/(.+)', 'BootController',
	'/', 'BootController'
]

def getRoutes():
	return tuple(urlmap)
	
def addRoute(p_url, p_class):
	urlmap.insert(0, p_class)
	urlmap.insert(0, p_url)

	