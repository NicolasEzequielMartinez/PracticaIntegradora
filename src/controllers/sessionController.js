import SessionService from "../services/session.service.js";

export default class SessionController {
    constructor() {
        this.sessionService = new SessionService();
    }
    // Métodos User Controller: 
    async createUserControler(req, res, info) {
        let response = {};
        try {
            const resultService = await this.sessionService.createUserService(info);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 200) {
                response.result = resultService.result;
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al registrar al usuario - Controller: " + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

    async getUserByEmailOrNameOrIdController( req, res, identifier) {
        let response = {};
        try {
            const resultService = await this.sessionService.getUserByEmailOrNameOrIdService(identifier);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 404) {
                req.logger.warn(response.message);
            } else if (resultService.statusCode === 200) {
                response.result = resultService.result;
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al obtener el usuario - Controller: " + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

    async updateUserController( req, res, uid, updatedUser) {
        let response = {};
        try {
            const resultService = await this.sessionService.updateUserProfileSevice(uid, updatedUser);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 404) {
                req.logger.warn(response.message);
            } else if (resultService.statusCode === 200) {
                response.result = resultService.result;
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al actualizar los datos del usuario - Controller:" + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

    async resetPass1Controller(req, res, next) {
        const userEmail = req.body.email;
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!userEmail || !emailRegex.test(userEmail))
                CustomError.createError({
                    name: "Error en el proceso de restrablecer contraseña.",
                    cause: ErrorGenerator.generateResetPass1Info(userEmail),
                    message: "El correo está incompleto o no es válido.",
                    code: ErrorEnums.INVALID_EMAIL_USER
                });
        } catch (error) {
            return next(error);
        };
        let response = {};
        try {
            const resultService = await this.sessionService.getUserByEmailAndSendEmail(userEmail);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 404) {
                req.logger.warn(response.message);
            } else if (resultService.statusCode === 200) {
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al enviar email para restablecer contraseña - Controller: " + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

    async resetPass2Controller(req, res, next) {
        const userEmail = req.user.email;
        const newPass = req.body.newPassword
        const confirmPass = req.body.confirmPassword
        try {
            if (!newPass || !confirmPass || newPass !== confirmPass)
                CustomError.createError({
                    name: "Error en el proceso de restrablecer contraseña.",
                    cause: ErrorGenerator.generateResetPass2Info(),
                    message: "Las contraseñas estan incompletas o no coinciden.",
                    code: ErrorEnums.INVALID_NEW_PASS_USER
                });
        } catch (error) {
            return next(error);
        };
        let response = {};
        try {
            const resultService = await this.sessionService.resetPassUser(userEmail, newPass);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 404 || resultService.statusCode === 400) {
                req.logger.warn(response.message);
            } else if (resultService.statusCode === 200) {
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al restablecer contraseña - Controller: " + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

    async changeRoleController(req, res, next) {
        const uid = req.params.uid
        try {
            if (!uid || !mongoose.Types.ObjectId.isValid(uid)) {
                CustomError.createError({
                    name: "Error al obtener al usuario por ID.",
                    cause: ErrorGenerator.generateUserIdInfo(uid),
                    message: "El ID de usuario proporcionado no es válido.",
                    code: ErrorEnums.INVALID_ID_USER_ERROR
                });
            }
        } catch (error) {
            return next(error);
        };
        let response = {};
        try {
            const resultService = await this.sessionService.changeRoleService( uid);
            response.statusCode = resultService.statusCode;
            response.message = resultService.message;
            if (resultService.statusCode === 500) {
                req.logger.error(response.message);
            } else if (resultService.statusCode === 404) {
                req.logger.warn(response.message);
            } else if (resultService.statusCode === 200) {
                req.logger.debug(response.message);
            };
        } catch (error) {
            response.statusCode = 500;
            response.message = "Error al modificar el rol del usuario - Controller: " + error.message;
            req.logger.error(response.message);
        };
        return response;
    };

};