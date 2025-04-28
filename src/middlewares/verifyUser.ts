import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";

export const addUserSchema = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  hp: Joi.string().required(),
  alamat: Joi.string().required(),
  profile: Joi.allow().optional(),
  role: Joi.string().valid(`Penjual`, `Pelanggan`).optional(),
});

export const updateUserSchema = Joi.object({
  nama: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  hp: Joi.string().optional(),
  alamat: Joi.string().optional(),
  profile: Joi.allow().optional(),
  role: Joi.string().valid(`Penjual`, `Pelanggan`).optional(),
});

export const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

export const verifyAuthentication = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { error } = authSchema.validate(request.body, { abortEarly: false });

  if (error) {
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyAddUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body dan mengambil info error jika terdapat error
  const { error } = addUserSchema.validate(request.body, { abortEarly: false });

  if (error) {
    // jika terdapat error, akan memberikan pesan seperti ini
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyEditUser = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body dan mengambil info error jika terdapat error
  const { error } = updateUserSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    // jika terdapat error, akan memberikan pesan seperti ini
    return response.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};
