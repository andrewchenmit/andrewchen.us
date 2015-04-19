# bootsmooth application entry
import web
import cgi
from bootsmooth import router, render

# Add Custom Routes to Controllers
# import controllers
router.addRoute('/flightdetailsdb', 'controllers.flightdetailsdb')
router.addRoute('/pricesdb', 'controllers.pricesdb')
router.addRoute('/threedayflightdetailsdb', 'controllers.threedayflightdetailsdb')
router.addRoute('/threedaypricesdb', 'controllers.threedaypricesdb')
router.addRoute('/clearmemcache', 'controllers.clearmemcache')
router.addRoute('/test', 'controllers.test')

# The BootController
# This is the default controller, routed to handle all paths -> /(.*)
class BootController:
  def GET(self, path=""):
    # Call render.path to render HTML Files in /www/default/html that match the path
    if path == 'andrewjennywedding':
      return render.page('/www/wedding/index.html')
    if path == 'travelroos' or path == 'weekendfares':
      return render.page('/www/travelroos/index.html')
    return render.page('/www/index.html')

# Run the application
if __name__ == '__main__':
  app = web.application(router.getRoutes(), globals())
  app.cgirun()
