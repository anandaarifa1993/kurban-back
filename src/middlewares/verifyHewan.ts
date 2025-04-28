import { NextFunction, Request, Response } from "express";
import Joi, { isSchema } from "joi";

// bikin skema dimana menambahkan hewan, semua fields harus diisi

export const addHewanSchema = Joi.object({
  berat: Joi.string().min(0).required(),
  umur: Joi.number().min(0).required(),
  harga: Joi.number().min(0).required(),
  kategori: Joi.string().valid(`SAPI`, `KAMBING`).required(),
  deskripsi: Joi.string().required(),
  foto: Joi.allow().optional(),
  statusHewan: Joi.string().valid(`TERSEDIA`, `HABIS`).default(`TERSEDIA`),
});

export const updateHewanSchema = Joi.object({
  berat: Joi.string().min(0).optional(),
  umur: Joi.number().min(0).optional(),
  harga: Joi.number().min(0).optional(),
  kategori: Joi.string().valid(`SAPI`, `KAMBING`).optional(),
  deskripsi: Joi.string().optional(),
  foto: Joi.allow().optional(),
  statusHewan: Joi.string().valid(`TERSEDIA`, `HABIS`).optional(),
});

export const verifyAddHewan = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body yang dikirimkan dan mengambil error jika terdapat error
  const { error } = addHewanSchema.validate(request.body, {
    abortEarly: false,
  });

  if (error) {
    // jika terdapat error akan memberikan pesan seperti ini
    return response.json({
      status: false,
      message: error.details.map((it) => it.message).join(),
    });
  }
  return next();
};

export const verifyEditHewan = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // validasi data dari request body dan mengambil info error jika terdapat error
  const { error } = updateHewanSchema.validate(request.body, {
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
