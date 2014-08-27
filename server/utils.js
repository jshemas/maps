'use strict';

/*
 * needs work on
 * -validatePlaceCord
 * -validateRateContent
 * -validateMaxDistance
*/


module.exports = {
	/*
	 * validateRegister is used in 'register'
	 */
	validateRegister: function (username, password, email, callback) {
		var usernameRes = this.validateUsername(username);
		var passwordRes = this.validatePassword(password);
		var emailRes = this.validateEmail(email);
		var errArr = [];
		if (usernameRes) {errArr.push(usernameRes); }
		if (passwordRes) {errArr.push(passwordRes); }
		if (emailRes) {errArr.push(emailRes); }
		callback(errArr);
	},

	/*
	 * validateUsername is used in 'isUsernameTaken' and 'getUserByUserName'
	 */
	validateTheUsername: function (username, callback) {
		var usernameRes = this.validateUsername(username);
		var errArr = [];
		if (usernameRes) {errArr.push(usernameRes); }
		callback(errArr);
	},

	/*
	 * validateIsEmailTaken is used in 'isEmailTaken'
	 */
	validateIsEmailTaken: function (email, callback) {
		var emailRes = this.validateEmail(email);
		var errArr = [];
		if (emailRes) {errArr.push(emailRes); }
		callback(errArr);
	},

	/*
	 * validateEditUser is used in 'editUser'
	 */
	validateEditUser: function (id, password, email, callback) {
		var idRes = this.validateId(id);
		var passwordRes = this.validatePassword(password);
		var emailRes = this.validateEmail(email);
		var errArr = [];
		if (idRes) {errArr.push(idRes); }
		if (passwordRes) {errArr.push(passwordRes); }
		if (emailRes) {errArr.push(emailRes); }
		callback(errArr);
	},

	/*
	 * validateLogIn is used in 'editUser'
	 */
	validateLogIn: function (username, password, callback) {
		var usernameRes = this.validateUsername(username);
		var passwordRes = this.validatePassword(password);
		var errArr = [];
		if (usernameRes) {errArr.push(usernameRes); }
		if (passwordRes) {errArr.push(passwordRes); }
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
	 * validateGetPlaceByLocation is used in 'getPlaceByLocation'
	 */
	validateGetPlaceByLocation: function(long, lat, maxDistance, callback) {
		var maxDistanceRes = this.validateMaxDistance(maxDistance);
		var latRes = this.validatePlaceCord(lat);
		var longRes = this.validatePlaceCord(long);
		var errArr = [];
		if(maxDistanceRes){errArr.push(maxDistanceRes);}
		if(latRes){errArr.push(latRes);}
		if(longRes){errArr.push(longRes);}
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
	 * validateIDS is used all over the place
	 */
	validateIDS: function (id, callback) {
		var idRes = this.validateId(id);
		var errArr = [];
		if (idRes) {errArr.push(idRes); }
		callback(errArr);
	},

	validateIDS2: function (id1, id2, callback) {
		var idRes1 = this.validateId(id1);
		var idRes2 = this.validateId(id2);
		var errArr = [];
		if (idRes1) {errArr.push(idRes1); }
		if (idRes2) {errArr.push(idRes2); }
		callback(errArr);
	},

	validateIDS3: function (id1, id2, id3, callback) {
		var idRes1 = this.validateId(id1);
		var idRes2 = this.validateId(id2);
		var idRes3 = this.validateId(id3);
		var errArr = [];
		if (idRes1) {errArr.push(idRes1); }
		if (idRes2) {errArr.push(idRes2); }
		if (idRes3) {errArr.push(idRes3); }
		callback(errArr);
	},

	/*
	 * validate var
	 * @param string var - user input
	 */
	validateVar: function (inputVar) {
		if (inputVar === null || (inputVar && inputVar.length < 1) || typeof inputVar === 'undefined' || !inputVar) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * validate number
	 * @param number num - user input: num
	 */
	validateNumber: function (num) {
		//word characters such as 0-9
		if (this.validateVar(num)) {
			var regex = /^\d+$/;
			if (regex.test(num)) {
				return;
			} else {
				return 'Invalid Number';
			}
		} else {
			return 'Invalid Number';
		}
	},

	/**
	 * validate username
	 * @param string username - user input: username
	 */
	validateUsername: function (username) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//must have at least one letter
		//between 6 and 40 characters long
		if (this.validateVar(username)) {
			var regex = /^(?=.*[a-zA-Z])([a-zA-Z0-9.@_]+){6,40}$/;
			if (regex.test(username)) {
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
	validatePassword: function (password) {
		//word characters such as 0-9, A-Z, a-z, _
		//literal period
		//literal @
		//between 6 and 40 characters long
		if (this.validateVar(password)) {
			var regex = /^[\w\.@]{6,40}$/;
			if (regex.test(password)) {
				return;
			} else {
				return 'Invalid Password';
			}
		} else {
			return 'Invalid Password';
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
	 * validate maxDistance
	 * @param number maxDistance - user input: maxDistance
	 */
	validateMaxDistance: function(maxDistance) {
		// should add more valideion on this
		// is this a number?
		if(this.validateVar(maxDistance)){
			var regex = /(\d+)/;
			if(regex.test(maxDistance)){
				return;
			} else {
				return 'Invalid Max Distance';
			}
		} else {
			return 'Invalid Max Distance';
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
	 * validate bool
	 * @param string bool - user input: bool
	 */
	validateBool: function (answerContent, flag) {
		//word characters such as 1 or 0
		//1 characters long
		if (answerContent === 'true' || answerContent === 'false') {
			return;
		} else {
			if (flag === 'vote') {
				return 'Invalid Vote';
			} else if (flag === 'anonymous') {
				return 'Invalid Anonymous Check';
			} else {
				return 'Invalid Bool';
			}
		}
	},

	/**
	 * validate id
	 * @param string id - user input: id
	 */
	validateId: function (id) {
		//word characters such as 0-9,
		//between 1 and 45 characters long
		if (this.validateVar(id)) {
			var regex = /^[0-9a-fA-F]{24}$/;
			if (regex.test(id)) {
				return;
			} else {
				return 'Invalid Id';
			}
		} else {
			return 'Invalid Id';
		}
	},

	/**
	 * mysqlRealEscapeString string
	 * @param string str - user input: string
	 */
	mysqlRealEscapeString: function (str) {
		var regex = /^\d{1,100}$/;
		if (regex.test(str)) {
			return str; //if str is a number, just return that
		} else {
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
					return "\\" + char; // prepends a backslash to backslash, percent, and double/single quotes
				}
			});
		}
	},

	/*
	 * validate page number
	 * @param num var - inputNumber
	 * @param function callback
	 */
	validatePageNumber: function (inputNumber, callback) {
		//is there a number?
		if (this.validateVar(inputNumber)) {
			var regex = /^\d+$/;
			if (regex.test(inputNumber)) {
				if (inputNumber > 100) {
					callback(1); // shouldn't get any page passed 100
				} else {
					callback(inputNumber); // page number is fine
				}
			} else {
				// bad number enter, return page one
				callback(1);
			}
		} else {
			// no page number enter, return page one
			callback(1);
		}
	},

	/**
	 * validate email
	 * @param string email - user input: email
	 */
	validateEmail: function (email) {
		// http://www.regular-expressions.info/email.html
		if (this.validateVar(email)) {
			var regex = /[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
			if (regex.test(email)) {
				return;
			} else {
				return 'Invalid Email';
			}
		} else {
			return 'Invalid Email';
		}
	}
};