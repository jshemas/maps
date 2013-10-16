var express = require('express'),
	http = require('http'),
	passport = require('passport'),
	User = require('./server/models/User.js');

var app = module.exports = express();

app.set('views', __dirname + '/client/app/views');
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/client'));
app.use(express.cookieSession({
	secret: 'choo choo'
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.localStrategy);

passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

require('./server/routes.js')(app);

app.set('port', process.env.PORT || 8080);
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});