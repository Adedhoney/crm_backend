import Joi from 'joi';

export const UserSchema = Joi.object({
    firstName: Joi.string().required(),
    gender: Joi.number().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
});
export const UserUpdateSchema = Joi.object({
    firstName: Joi.string().required(),
    gender: Joi.number().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().allow('').optional(),
    DOB: Joi.date().optional(),
    phone: Joi.string().required(),
    location: Joi.string().allow('').optional(),
});
export const InviteSchema = Joi.object({
    userType: Joi.number().required(),
    email: Joi.string().required(),
});

export const LogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
export const UpdatePassWordSchema = Joi.object({
    password: Joi.string().required(),
});
export const VerifyOtpSchema = Joi.object({
    email: Joi.string().required(),
    otp: Joi.string().required(),
});
export const ResetPasswordSchema = Joi.object({
    otpToken: Joi.string().required(),
    newPassword: Joi.string().required(),
});

export const ClientSchema = Joi.object({
    name: Joi.string().required(),
    industry: Joi.string().required(),
    email: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    type: Joi.number().required(),
    bankingDetails: Joi.string().allow('').optional(),
    responsibleUserId: Joi.string().allow('').optional(),
});

export const ContactSchema = Joi.object({
    clientId: Joi.string().allow('').optional(),
    name: Joi.string().required(),
    email: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    role: Joi.string().allow('').optional(),
    title: Joi.string().allow('').optional(),
    responsibleUserId: Joi.string().allow('').optional(),
});

export const ReportSchema = Joi.object({
    clientId: Joi.string().allow('').optional(),
    contactId: Joi.string().allow('').optional(),
    title: Joi.string().required(),
    text: Joi.string().required(),
});
