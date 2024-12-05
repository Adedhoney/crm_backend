import Joi from 'joi';

export const UserSchema = Joi.object({
    firstName: Joi.string().required(),
    gender: Joi.number().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    middleName: Joi.string().required(),
    DOB: Joi.date().required(),
    phone: Joi.string().required(),
    location: Joi.string().required(),
});
export const InviteSchema = Joi.object({
    UserType: Joi.string().required(),
    email: Joi.string().required(),
});

export const LogInSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
export const UpdateInfoSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
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
    email: Joi.string().required(),
    phone: Joi.string().required(),
    bankingDetails: Joi.string().required(),
    responsibleUserId: Joi.date().required(),
});

export const ContactSchema = Joi.object({
    clientId: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().required(),
    title: Joi.date().required(),
    responsibleUserId: Joi.date().required(),
});

export const ReportSchema = Joi.object({
    clientId: Joi.string().optional(),
    contactId: Joi.string().optional(),
    title: Joi.string().required(),
    text: Joi.string().required(),
});
