import { Request, Response } from "express";
import { PrismaClient, statusBayar } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { request } from "http";
import { number } from "joi";
import { BASE_URL } from "../global";
import fs, { stat } from "fs";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllHewan = async (request: Request, response: Response) => {
  try {
    const { search } = request.query;
    const allHewan = await prisma.hewan.findMany({
      where: {
        berat: {
          contains: search?.toString() || ""
        },
      },
    });
    // equals berarti mencari sesuai umur yang tepat

    // output
    return response
      .json({
        status: true,
        data: allHewan,
        message: `Hewan Berhasil Ditampilkan`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi Sebuah Kesalahan. ${error}`,
      })
      .status(400);
  }
};

export const addHewan = async (request: Request, response: Response) => {
  try {
    // mengambil data dari request body
    const { berat, umur, harga, kategori, deskripsi } = request.body;
    const { user } = request.body.user;
    const uuid = uuidv4();

    // proses menyimpan data hewan yang telah diinput hewan
    const newHewan = await prisma.hewan.create({
      data: { uuid, umur, kategori, berat, harga: Number(harga), deskripsi },
    });

    return response
      .json({
        status: true,
        data: newHewan,
        user: user,
        message: `Hewan Berhasil Ditambahkan`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi Sebuah Kesalahan ${error}`,
      })
      .status(400);
  }
};

export const updateHewan = async (request: Request, response: Response) => {
  try {
    const { idHewan } = request.params; // mendapatkan request berupa ID yang dikirim melalui parameter
    const { user } = request.body.user;
    const { berat, umur, harga, kategori, deskripsi, statusHewan } = request.body; // mendapatkan request data dair body

    // memastikan data ada di database
    const findHewan = await prisma.hewan.findFirst({
      where: { idHewan: { equals: Number(idHewan) } },
    });
    if (!findHewan)
      return response.status(200).json({
        status: false,
        message: `Hewan tidak ditemukan`,
      });

    const updateHewan = await prisma.hewan.update({
      data: {
        berat: berat || findHewan.berat,
        umur: umur ? Number(umur) : findHewan.umur,
        harga: harga ? Number(harga) : findHewan.harga,
        kategori: kategori || findHewan.kategori,
        deskripsi: deskripsi || findHewan.deskripsi,
        idPenjual: user ? user.id : findHewan.idPenjual,
        statusHewan: statusHewan || findHewan.statusHewan
      },
      where: { idHewan: Number(idHewan) },
    });

    return response
      .json({
        status: true,
        data: updateHewan,
        message: `Hewan berhasil di update`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        massage: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const changePicture = async (request: Request, response: Response) => {
  try {
    const { id } = request.params; // mendapatkan id menu yang dikirimkan melalui parameter

    // id dicek apakah ada tau tidak
    const findHewan = await prisma.hewan.findFirst({
      where: { idHewan: Number(id) },
    });
    if (!findHewan)
      return response.status(200).json({
        status: false,
        message: `Menu tidak ditemukan`,
      });

    // default value untuk filename
    let filename = findHewan.foto;

    if (request.file) {
      // update nama file dari foto yang di upload
      filename = request.file.filename;

      // cek foto yang lama di dalam folder
      let path = `${BASE_URL}../public/hewan_picture/${findHewan.foto}`;
      let exists = fs.existsSync(path);

      // hapus foto yang lama jika di upload file baru
      if (exists && findHewan.foto !== ``) fs.unlinkSync(path); // unlinksync untuk menghapus file tersebut
    }

    const updatePicture = await prisma.hewan.update({
      data: { foto: filename },
      where: { idHewan: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updatePicture,
        messgae: `Foto Telah Diubah`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `there is an error ${error}`,
      })
      .status(400);
  }
};

export const deleteHewan = async (request: Request, response: Response) => {
  try {
    const { idHewan } = request.params; // mendapatkan id hewan dari request params

    // id hewan dicek ada atau tidak
    const findHewan = await prisma.hewan.findFirst({
      where: { idHewan: { equals: Number(idHewan) } },
    });
    if (!findHewan)
      return response.status(200).json({
        status: false,
        message: `Hewan tidak ditemukan`,
      });

    let path = `${BASE_URL}../public/menu_picture/${findHewan.foto}`;
    let exists = fs.existsSync(path);

    // hapus foto yang lama jika file baru di upload
    if (exists && findHewan.foto !== ``) fs.unlinkSync(path);

    // proses untuk delete hewan
    const deleteHewan = await prisma.hewan.delete({
      where: { idHewan: Number(idHewan) },
    });

    return response
      .json({
        status: true,
        data: deleteHewan,
        message: `Hewan berhasil dihapus`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `there is an error ${error}`,
      })
      .status(200);
  }
};