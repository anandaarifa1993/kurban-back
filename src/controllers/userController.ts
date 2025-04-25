import { Request, Response } from "express";
import { PrismaClient, statusBayar} from "@prisma/client";
import { v4 as uuidv4 } from "uuid"
import { request } from "http";
import { number } from "joi";
import { BASE_URL, SECRET } from "../global";
import fs, { stat } from "fs";
import md5 from "md5" // autentikasi
import { sign } from "jsonwebtoken"; // memberikan token untuk login

const prisma = new PrismaClient({errorFormat: "pretty"})


export const createUser = async(request: Request, response: Response) => {
    try {
        const { nama, email, password, hp, alamat, role } = request.body
        const uuid = uuidv4()

        const newUser = await prisma.user.create({
            data: { uuid, nama, email, password: md5(password), hp, alamat, role }
        })

        return response.json({
            status: true,
            data: newUser,
            message: `User Berhasil Di Buat`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi Sebuah Kesalahan ${error}`
        }).status(400)
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { idPenjual } = request.params
        const { nama, email, password, hp, alamat, role } = request.body

        const findUser = await prisma.user.findFirst({where: { idUser: {equals: Number(idPenjual)}}})
        if (!findUser) return response.status(200).json({
            status: false,
            message: `User tidak ditemukan`
        })

        const updateUser = await prisma.user.update({
            data: {
                nama: nama || findUser.nama,
                email: email || findUser.email,
                password: password ? md5(password) : findUser.password,
                hp: hp || findUser.hp,
                alamat: alamat || findUser.alamat,
                role: role || findUser.role
            }, where: {idUser: Number(idPenjual)}
        })

        return response.json({
            status: true,
            data: updateUser,
            message: `User berhasil di update`
        }).status(200)
    } catch (error) {
        return response.json({
            status: false,
            message: `Terjadi Sebuah Kesalahan ${error}`
        }).status(400)
    }
}

// export const penjualPicture = async (request: Request, response: Response) => {
//     try {
//         const { idPenjual } = request.params

//         const findPenjual = await prisma.user.findFirst({ where: { idUser: {equals: parseInt(idPenjual)} }})
//         if (!findPenjual) return response.status(200).json({
//             status: false,
//             message: `Menu tidak ditemukan`
//         })

//         // default value untuk filename
//         let filename = findPenjual.profile

//         if (request.file) {
//             // update nama file dari foto yang di upload
//             filename = request.file.filename
            
//             // cek foto yang lama di dalam folder
//             let path = `${BASE_URL}../public/penjual_picture/${findPenjual.profile}`
//             let exists = fs.existsSync(path)

//             // hapus foto yang lama jika di upload file baru
//             if (exists && findPenjual.profile !== ``) fs.unlinkSync(path) // unlinksync untuk menghapus file tersebut
//         }

//         const updatePicture = await prisma.user.update({
//             data: { profile: filename },
//             where: { idUser: Number(idPenjual) }
//         })

//         return response.json({
//             status: true,
//             data: updatePicture,
//             messgae: `Foto Telah Diubah`
//         }).status(200)
//     } catch (error) {
//         return response.json({
//             status: false,
//             message: `Terjadi Sebuah Kesalahan ${error}`
//         }).status(400)
//     }
// }

export const penjualPicture = async (request: Request, response: Response): Promise<void> => {
    try {
  
      const { idPenjual } = request.params;
      const findPenjual = await prisma.user.findFirst({where: {idUser: { equals: parseInt(idPenjual) }}})
      if (!findPenjual){
        response.status(200).json({ status: false, massage:`user with id ${idPenjual} is not found`})
        return;
      }
      // Default value for filename
      let filename = findPenjual.profile;
  
      if (request.file) {
        // Update the file name of the uploaded photo
        filename = request.file.filename;
  
        // Check for old photo in folder
        const path = `${BASE_URL}../public/penjual_picture/${findPenjual.profile}`;
        const exists = fs.existsSync(path);
  
        // Delete old photo if a new one is uploaded
        if (exists && findPenjual.profile !== '') fs.unlinkSync(path);
      }
  
      const updatePicture = await prisma.user.update({
        data: { profile: filename },
        where: { idUser: Number(idPenjual) }
      });
  
      response.json({
        status: true,
        data: updatePicture,
        message: `Foto Telah Diubah`
      }).status(200);
  
    }
    catch (error) {
        response.json({
          status: false,
          message: `Terjadi Sebuah Kesalahan ${error}`
        }).status(400);
      }
    }
    

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { idPenjual } = request.params

        const findPenjual = await prisma.user.findFirst({ where: { idUser: Number(idPenjual) }})
        if (!findPenjual) return response.status(200).json({
            status: false,
            message: `Menu tidak ditemukan`
        })

        // cek foto di dalam folder
        let path = `${BASE_URL}../public/penjual_picture/${findPenjual.profile}`
        let exists = fs.existsSync(path)

        // hapus foto yang lama jika file baru di upload
        if(exists && findPenjual.profile !== ``) fs.unlinkSync(path)
        
        const deleteUser = await prisma.user.delete({
            where: { idUser: Number(idPenjual) }
        })

        return response.json({
            status: true,
            data: deleteUser,
            message: `User berhasil dihapus`
        }).status(200)
    } catch (error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}

export const authentication = async (request: Request, response: Response) => {
    try {
        const { email, password } = request.body
        
        const user = await prisma.user.findFirst({
            where: { email, password: md5(password) }
        })

        if (!user) return response.status(200).json({
            status: false,
            logged: false,
            message: `Email atau Password invalid`
        })

        let data = {
            id: user.idUser,
            name: user.nama,
            email: user.email,
            role: user.role
        }

        // menyiapkan data yang akan dijadikan token
        let payload = JSON.stringify(data)

        // sign untuk generate token
        let token = sign(payload, SECRET || "token")

        return response.status(200).json({
            status: true,
            logged: true,
            message: `Login sukses`,
            token
        })

    } catch(error) {
        return response.json({
            status: true,
            message: `Terjadi sebuah kesalahan ${error}`
        }).status(400)
    }
}