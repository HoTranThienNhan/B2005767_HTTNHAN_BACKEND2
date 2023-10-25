const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require('bcrypt');

exports.signin = async (req, res, next) => {
    if (!req.body?.email) {
        return next(new ApiError(400, "Email không được để trống."));
    } 
    if (!req.body?.password) {
        return next(new ApiError(400, "Mật khẩu không được để trống."));
    } 

    try {
        const userService = new UserService(MongoDB.client);
        const { email, password } = req.body;

        const document = await userService.signin(req.body);

        if (!document) {
            return next(new ApiError(404, "Tài khoản hoặc mật khẩu không đúng."));
        } else {
            // compare password and password in database
            const comparePassword = bcrypt.compareSync(password, document?.password);
            if (!comparePassword) {
                return next(new ApiError(404, "Tài khoản hoặc mật khẩu không đúng."));
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
        return next(new ApiError(400, "Họ tên không được để trống."));
    } 
    if (!req.body?.email) {
        return next(new ApiError(400, "Email không được để trống."));
    } 
    if (!req.body?.phone) {
        return next(new ApiError(400, "Số điện thoại không được để trống."));
    } 
    if (!req.body?.address) {
        return next(new ApiError(400, "Địa chỉ không được để trống."));
    } 
    if (!req.body?.password) {
        return next(new ApiError(400, "Mật khẩu không được để trống."));
    } 
    if (!req.body?.confirmPassword) {
        return next(new ApiError(400, "Mật khẩu nhập lại không được để trống."));
    } 
    if (req.body?.password !== req.body?.confirmPassword) {
        return next(new ApiError(400, "Mật khẩu và mật khẩu nhập lại không trùng khớp."));
    }
    
    try {
        const userService = new UserService(MongoDB.client);
        const existedUser = await userService.findByEmail(req.body?.email);
        if (existedUser) {
            return next(new ApiError(400, "Tài khoản đã tồn tại."));
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
            return next(new ApiError(404, "Không tìm thấy tài khoản"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with email = ${req.params.id}`)
        );
    }
};
