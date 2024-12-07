require('dotenv').config();
const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');
// const InputError = require('../exceptions/InputError');

(async () => {
	const server = Hapi.server({
		port: process.env.PORT || 8080,
		host: '0.0.0.0',
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});

	const model = await loadModel();
	server.app.model = model;

	server.route(routes);

	server.ext('onPreResponse', function (request, h){
		const response = request.response;

		const contentLength = request.headers['content-length'];
        if (contentLength && parseInt(contentLength) > 1000000) {
            return h.response({
                status: 'fail',
                message: 'Payload content length greater than maximum allowed: 1000000',
            }).code(413);
        }

		if (response.isBoom) {
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400);
        }

        return h.continue;
	})
	await server.start();
	console.log(`Server start at: ${server.info.uri}`);
})();