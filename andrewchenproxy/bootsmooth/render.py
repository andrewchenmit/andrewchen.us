# bootsmooth utility module
#  render.py
import web
import pystache
from google.appengine.api import urlfetch

# Render.Page - return a static HTML file
def page(p_path):
	try:
		page = urlfetch.fetch(web.ctx.homedomain+p_path)
		return page.content
		
	except Exception as e:
		#return baseRenderer(str(e))
		return e

# Render.Template - Render a base template
def template(p_base, p_obj={}):
	
	try:
		base = urlfetch.fetch(web.ctx.homedomain+p_base)
		
		if base.content:
			return pystache.render(base.content, p_obj)
		else:
			return 'Error retrieving the page, contact the adminstrators'
	except Exception as e:
		return e

# Render SubTemplate Function - Here we explicitly pass a location for the base template and a rendered template string to insert at {{content}}
# NOTE: The rendered template string can be a render.path result
def subTemplate(p_base, p_template):
	
	return template(p_base, {'content': p_template})
		
# Render.Path Function - Match URL -> base_dir + static html file. Render base template with passed view object
# @params: path, base directory for HTML, template object to render
# @returns: $content string
def path(p_path, p_base_dir="", p_obj={}):
		
	base_dir = web.ctx.homedomain+p_base_dir

	try:
		errorPage = urlfetch.fetch(base_dir+'/error.html')

		if p_path == "":
			path = 'index'
		else:
			path = p_path
		
		base = urlfetch.fetch(base_dir+'/base.html')
		#baseRenderer =  web.template.Template(base.content)
		
		page = urlfetch.fetch(base_dir+'/'+path+'.html')
		
		if page.content:
			# append page content to the passed dictionary
			p_obj['content'] = page.content
			
		else:
			# append error page content to the passed dictionary
			p_obj['content'] = errorPage.content
		
		return pystache.render(base.content, p_obj)		
		
	except Exception as e:
		#return baseRenderer(str(e))
		return e
