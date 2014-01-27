# bootsmooth
# utility.py

from django.utils import simplejson

def json_error(p_err):
	return simplejson.dumps({'error': p_err})

def json_dump(p_obj):
	return simplejson.dumps(p_obj)