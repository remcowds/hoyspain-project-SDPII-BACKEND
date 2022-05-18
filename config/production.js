module.exports = {
	cors: {
		//URL webapp front-end
		origins: [/http:\/\/localhost:3000/g, /^[a-zA-Z0-9_:\/.-]*capable-pastelito-db7998.netlify.app/g, /^[a-zA-Z0-9_:\/.-]*hoyspain.ga/g],
		maxAge: 3 * 60 * 60,
	},
	connectionDB: {
		name: 'MnvyNkjdYH',
		client: 'mysql2',
		host: '127.0.0.1',
		port: '3306',
	},
	pagination: {
		limit: 100,
		offset: 0,
	},
	auth: {
		argon: {
			saltLength: 16,
			hashLength: 32,
			timeCost: 6,
			memoryCost: 2 ** 17,
		},
		jwt: {
			expirationInterval: 60 * 60 * 1000, // ms (1 hour)
			issuer: 'budget.hogent.be',
			audience: 'budget.hogent.be',
		},
	},
};