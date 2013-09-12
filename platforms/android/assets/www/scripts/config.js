var RoutingConfig = function(exports) {

	// define users roles
	var usersRoles = {
		'public' : 1,
		'user': 2,
		'admin': 4
	};

	exports.usersRoles = usersRoles;

	// define accessleveles for each usersROles
	exports.accessLevels  = {
		'public': [userRoles.public, userRoles.user, userRoles.admin],
		'user' : [userRoles.user, userRoles.admin],
		'admin': [userRoles.admin]
	}


};