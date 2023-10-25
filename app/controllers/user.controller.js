const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require('bcrypt');

exports.signin = async (req, res, next) => {
    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    } 
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    } 

    try {
        const userService = new UserService(MongoDB.client);
        const { email, password } = req.body;
        
        if (!email) {
            return next(new ApiError(404, "Email is required"));
        }
        if (!password) {
            return next(new ApiError(404, "Password is required"));
        }

        const document = await userService.signin(req.body);

        if (!document) {
            return next(new ApiError(404, "Email or password incorrect"));
        } else {
            // compare password and password in database
            const comparePassword = bcrypt.compareSync(password, document?.password);
            if (!comparePassword) {
                return next(new ApiError(404, "Email or password incorrect"));
            }
        }

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.signup = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    } 
    if (!req.body?.email) {
        return next(new ApiError(400, "Email can not be empty"));
    } 
    if (!req.body?.phone) {
        return next(new ApiError(400, "Phone can not be empty"));
    } 
    if (!req.body?.address) {
        return next(new ApiError(400, "Address can not be empty"));
    } 
    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    } 
    if (!req.body?.confirmPassword) {
        return next(new ApiError(400, "Confirm password can not be empty"));
    } 
    if (req.body?.password !== req.body?.confirmPassword) {
        return next(new ApiError(400, "Password and confirm password does not match"));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const existedUser = await userService.findByEmail(req.body?.email);
        if (existedUser) {
            return next(new ApiError(400, "User already exists"));
        }
        const document = await userService.signup(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

exports.findByEmail = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findByEmail(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with email=${req.params.id}`)
        );
    }
};
