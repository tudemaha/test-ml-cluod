const { postPredictHandler } = require('../server/handler');
const { getAllPredict } = require('../server/handler');
const routes = [
	{
		path:'/predict',
		method: 'POST',
		handler: postPredictHandler,
		options: {
			payload: {
				allow: 'multipart/form-data',
				multipart: true
			}
		}
	},
	{
		path:'/predict/histories',
		method: 'GET',
		handler: getAllPredict,
	}
]

module.exports = routes;