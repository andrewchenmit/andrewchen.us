from bootsmooth import utility

class test:
	def GET(self):
		data = {
			'firstName': 'Any',
			'lastName': 'Developer'
		}
		
		return utility.json_dump(data)