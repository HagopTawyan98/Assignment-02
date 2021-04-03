const express = require('express');
const router = express.Router();
const users = require("../users/users.service");
const asyncHandler = require('express-async-handler');
const {ADMIN_ROLE} = require('../commons/util');
const { Unauthorized } = require('http-errors');

router.patch('/unlock-user/:id', asyncHandler(async (req, res) => {
    if(req.user.role !== ADMIN_ROLE){
        throw new Unauthorized();
    }
    const { id } = req.params;

    const payload = {
        lockCheck: false,
        loginAttempts: 0
    }

    await users.update(id, payload);
	res.status(200).json({message: "User has successfully been unlocked!"});
}))

router.patch('/lock-user/:id', asyncHandler(async (req, res) => {
    if(user.role !== ADMIN_ROLE){
        throw new Unauthorized();
    }
    const { id } = req.params;

	await users.update(id, payload);
	res.status(200).json({message: "User has successfully been locked!"});
}))

module.exports = router;