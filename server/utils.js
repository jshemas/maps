'use strict';
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
	 * validateIDS is used in (all over)
	 */
	validateIDS: function(id, callback) {
		var idRes = this.validateId(id);
		var errArr = [];
		if(idRes){errArr.push(idRes);}
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