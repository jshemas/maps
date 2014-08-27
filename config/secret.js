module.exports = {
	mongoPath: process.env.MONGODB || 'mongodb://localhost/maps',
	jwtSecret: process.env.JWTSECRET || 'youllneverguessthishahaha',
	encryptionKey: process.env.ENCRYPTIONKEY || 'thisisthebestkeyever'
};