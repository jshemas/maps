'use strict';

/*
 * needs work on
 * -validatePlaceCord
 * -validateRateContent
*/


module.exports = {
	/*
	 * validateRegister is used in 'register'
	 */
	validateRegister: function(username, password, email, callback) {
		var usernameRes = this.validateUsername(username);
		var passwordRes = this.validatePassword(password);
		var emailRes = this.validateEmail(email);
		var errArr = [];
		if(usernameRes){errArr.push(usernameRes);}
		if(passwordRes){errArr.push(passwordRes);}
		if(emailRes){errArr.push(emailRes);}
		callback(errArr);
	},

	/*
	 * validateEditUser is used in 'editUser'
	 */
	validateEditUser: function(id, password, email, callback) {
		var idRes = this.validateId(id);
		var passwordRes = this.validatePassword(password);
		var emailRes = this.validateEmail(email);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(passwordRes){errArr.push(passwordRes);}
		if(emailRes){errArr.push(emailRes);}
		callback(errArr);
	},

	/*
	 * validateLogIn is used in 'editUser'
	 */
	validateLogIn: function(username, password, callback) {
		var usernameRes = this.validateUsername(username);
		var passwordRes = this.validatePassword(password);
		var errArr = [];
		if(usernameRes){errArr.push(usernameRes);}
		if(passwordRes){errArr.push(passwordRes);}
		callback(errArr);
	},

	/*
	 * validateCreatePlace is used in 'createPlace'
	 */
	validateCreatePlace: function(name, lat, long, description, category, callback) {
		var nameRes = this.validatePlaceName(name);
		var latRes = this.validatePlaceCord(lat);
		var longRes = this.validatePlaceCord(long);
		var descriptionRes = this.validatePlaceDescription(description);
		var categoryRes = this.validatePlaceCategory(category);
		var errArr = [];
		if(nameRes){errArr.push(nameRes);}
		if(latRes){errArr.push(latRes);}
		if(longRes){errArr.push(longRes);}
		if(descriptionRes){errArr.push(descriptionRes);}
		if(categoryRes){errArr.push(categoryRes);}
		callback(errArr);
	},

	/*
	 * validateEditPlace is used in 'editPlace'
	 */
	validateEditPlace: function(id, name, lat, long, description, category, callback) {
		var idRes = this.validateId(id);
		var nameRes = this.validatePlaceName(name);
		var latRes = this.validatePlaceCord(lat);
		var longRes = this.validatePlaceCord(long);
		var descriptionRes = this.validatePlaceDescription(description);
		var categoryRes = this.validatePlaceCategory(category);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(nameRes){errArr.push(nameRes);}
		if(latRes){errArr.push(latRes);}
		if(longRes){errArr.push(longRes);}
		if(descriptionRes){errArr.push(descriptionRes);}
		if(categoryRes){errArr.push(categoryRes);}
		callback(errArr);
	},

	/*
	 * validateAddComment is used in 'addComment'
	 */
	validateAddComment: function(id, content, callback) {
		var idRes = this.validateId(id);
		var contentRes = this.validateCommentContent(content);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(contentRes){errArr.push(contentRes);}
		callback(errArr);
	},

	/*
	 * validateEditComment is used in 'editComment'
	 */
	validateEditComment: function(content, id, id2, callback) {
		var idRes = this.validateId(id);
		var contentRes = this.validateCommentContent(content);
		var idRes2 = this.validateId(id2);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(contentRes){errArr.push(contentRes);}
		if(idRes2){errArr.push(idRes2);}
		callback(errArr);
	},

	/*
	 * validateAddRate is used in 'addRate'
	 */
	validateAddRate: function(id, content, callback) {
		var idRes = this.validateId(id);
		var contentRes = this.validateRateContent(content);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(contentRes){errArr.push(contentRes);}
		callback(errArr);
	},

	/*
	 * validateEditRate is used in 'editRate'
	 */
	validateEditRate: function(content, id, id2, callback) {
		var idRes = this.validateId(id);
		var contentRes = this.validateRateContent(content);
		var idRes2 = this.validateId(id2);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(contentRes){errArr.push(contentRes);}
		if(idRes2){errArr.push(idRes2);}
		callback(errArr);
	},

	/*
	 * validateIDS is used in (all over)
	 */
	validateIDS: function(id, callback) {
		var idRes = this.validateId(id);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		callback(errArr);
	},

	/*
	 * validateIDS2 is used in (all over)
	 */
	validateIDS2: function(id, id2, callback) {
		var idRes = this.validateId(id);
		var idRes2 = this.validateId(id2);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
		if(idRes2){errArr.push(idRes2);}
		callback(errArr);
	},
	/*
	 * validate var
	 * @param string var - user input
	 */
	validateVar: function(inputVar) {
		if ( inputVar === null || (inputVar && inputVar.length < 1) || typeof inputVar === 'undefined' || !inputVar) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * validate id
	 * @param string id - user input: id
	 */
	validateId: function(id) {
		//word characters such as a-z, 0-9,
		//between 1 and 45 characters long
		if(this.validateVar(id)){
			var regex = /^[a-z0-9]{1,45}$/;
			if(regex.test(id)){
				return;
			} else {
				return 'Invalid Id';
			}
		} else {
			return 'Invalid Id';
		}
	},

	/**
	 * validate username
	 * @param string username - user input: username
	 */
	validateUsername: function(username) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//between 6 and 40 characters long
		if(this.validateVar(username)){
			var regex = /^[\w\.@]{6,40}$/;
			if(regex.test(username)){
				return;
			} else {
				return 'Invalid Username';
			}
		} else {
			return 'Invalid Username';
		}
	},

	/**
	 * validate password
	 * @param string password - user input: password
	 */
	validatePassword: function(password) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//between 6 and 40 characters long
		if(this.validateVar(password)){
			var regex = /^[\w\.@]{6,40}$/;
			if(regex.test(password)){
				return;
			} else {
				return 'Invalid Password';
			}
		} else {
			return 'Invalid Password';
		}
	},

	/**
	 * validate bool
	 * @param string bool - user input: bool
	 */
	validateBool: function(boolContent) {
		//word characters such as 1 or 0
		//1 characters long
		if(boolContent === 1 || boolContent === 0){
			return;
		} else {
			return 'Invalid Bool';
		}
	},

	/**
	 * validate place name
	 * @param string name - user input: name
	 */
	validatePlaceName: function(name) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		// space
		//between 3 and 40 characters long
		if(this.validateVar(name)){
			var regex = /^[\w\.@ ]{3,40}$/;
			if(regex.test(name)){
				return;
			} else {
				return 'Invalid Name';
			}
		} else {
			return 'Invalid Name';
		}
	},

	/**
	 * validate coordinates
	 * @param number coordinates - user input: coordinates
	 */
	validatePlaceCord: function(cord) {
		// should add more valideion on this
		// is this a number?
		if(this.validateVar(cord)){
			var regex = /(\d+)/;
			if(regex.test(cord)){
				return;
			} else {
				return 'Invalid Coordinates';
			}
		} else {
			return 'Invalid Coordinates';
		}
	},

	/**
	 * validate description
	 * @param string description - user input: description
	 */
	validatePlaceDescription: function(description) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		// space
		//between 6 and 40 characters long
		if(this.validateVar(description)){
			var regex = /^[\w\.@ ]{6,40}$/;
			if(regex.test(description)){
				return;
			} else {
				return 'Invalid Description';
			}
		} else {
			return 'Invalid Description';
		}
	},

	/**
	 * validate category
	 * @param string category - user input: category
	 */
	validatePlaceCategory: function(category) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		// space
		//between 6 and 40 characters long
		if(this.validateVar(category)){
			var regex = /^[\w\.@ ]{6,40}$/;
			if(regex.test(category)){
				return;
			} else {
				return 'Invalid Category';
			}
		} else {
			return 'Invalid Category';
		}
	},

	/**
	 * validate places comment content
	 * @param string content - user input: content
	 */
	validateCommentContent: function(content) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		// space
		//between 6 and 40 characters long
		if(this.validateVar(content)){
			var regex = /^[\w\.@ ]{6,40}$/;
			if(regex.test(content)){
				return;
			} else {
				return 'Invalid Comment';
			}
		} else {
			return 'Invalid Comment';
		}
	},

	/**
	 * validate places rate content
	 * @param number rate - user input: rate
	 */
	validateRateContent: function(rate) {
		// should add more valideion on this
		// is this a number?
		if(this.validateVar(rate)){
			var regex = /(\d+)/;
			if(regex.test(rate)){
				return;
			} else {
				return 'Invalid Rate';
			}
		} else {
			return 'Invalid Rate';
		}
	},

	/**
	 * mysqlRealEscapeString string
	 * @param string str - user input: string
	 */
	mysqlRealEscapeString: function(str) {
		return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
			switch (char) {
			case "\0":
				return "\\0";
			case "\x08":
				return "\\b";
			case "\x09":
				return "\\t";
			case "\x1a":
				return "\\z";
			case "\n":
				return "\\n";
			case "\r":
				return "\\r";
			case "\"":
			case "'":
			case "\\":
			case "%":
				return "\\"+char; // prepends a backslash to backslash, percent, and double/single quotes
			}
		});
	},

	/**
	 * validate email
	 * @param string email - user input: email
	 */
	validateEmail: function(email) {
		// http://www.regular-expressions.info/email.html
		if(this.validateVar(email)){
			var regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
			if(regex.test(email)){
				return;
			} else {
				return 'Invalid Email';
			}
		} else {
			return 'Invalid Email';
		}
	}
};