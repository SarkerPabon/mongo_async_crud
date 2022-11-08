/* const fsPromises = require("fs").promises;
const path = require("path");

const usersDB = {
	users: require("../model/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
}; */

const User = require("../model/User");

const handleLogout = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(204);

	const refreshToken = cookies.jwt;

	/* const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	); */
	const foundUser = await User.findOne({ refreshToken }).exec();

	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: "None",
			// secure: true,
		});
		return res.sendStatus(204);
	}

	/* const otherUsers = usersDB.users.filter(
		(person) => person.refreshToken !== foundUser.refreshToken
	);

	const currentUser = { ...foundUser, refreshToken: "" };

	usersDB.setUsers({ ...otherUsers, currentUser });

	await fsPromises.writeFile(
		path.join(__dirname, "..", "views", "users.json"),
		JSON.stringify(usersDB.users)
	); */

	// Delete refreshToken in db
	foundUser.refreshToken = "";
	const result = await foundUser.save();
	console.log(result);

	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		// secure: true,
	});

	res.sendStatus(204);
};

module.exports = { handleLogout };
