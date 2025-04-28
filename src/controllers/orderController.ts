import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllOrders = async (request: Request, response: Response) => {
  try {
    const { search, status, start_date, end_date } = request.query;

    // const filterConditions: any = {
    //   OR: [
    //     { statusBayar : { equals: search?.toLocaleString()} }
    //   ],
    // };

    // if (status) {
    //   filterConditions.status = status.toString();
    // }

    // if (start_date && end_date) {
    //   filterConditions.createdAt = {
    //     gte: new Date(start_date.toString()),
    //     lte: new Date(end_date.toString()),
    //   };
    // }

    const allOrders = await prisma.transaksi.findMany({
      orderBy: { createdAt: "desc" },
      include: { detailTransaksi: true },
    });
    return response
      .json({
        status: true,
        data: allOrders,
        message: `List order telah diterima`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

// export const createOrder = async (request: Request, response: Response) => {
//   try {
//     /** get requested data (data has been sent from request) */
//     const { pembayaran, totalBayar, detailTransaksi } = request.body;
//     const user = request.body.user;
//     const uuid = uuidv4();

//     /**
//      * assume that "orderlists" is an array of object that has keys:
//      * menuId, quantity, note
//      * */

//     /** loop details of order to check menu and count the total price */
//     let total_price = 0;
//     for (let index = 0; index < detailTransaksi.length; index++) {
//       const { hewanId } = detailTransaksi[index];
//       const detailHewan = await prisma.hewan.findFirst({
//         where: {
//           idHewan: hewanId,
//         },
//       });
//       if (!detailHewan)
//         return response.status(200).json({
//           status: false,
//           message: `Menu with id ${hewanId} is not found`,
//         });
//       total_price += detailHewan.harga * detailTransaksi[index].quantity;
//     }

//     /** process to save new order */
//     const newOrder = await prisma.transaksi.create({
//       data: {
//         uuid,
//         user,
//         pembayaran,
//         totalBayar,
//       },
//     });

//     /** loop details of Order to save in database */
//     for (let index = 0; index < detailTransaksi.length; index++) {
//       const uuid = uuidv4();
//       const { idTransaksi, hewanId } = detailTransaksi[index];
//       await prisma.detailTransaksi.create({
//         data: {
//           uuid,
//           idTransaksi: newOrder.idTransaksi,
//           idHewan: Number(hewanId),
//         },
//       });
//     }
//     return response
//       .json({
//         status: true,
//         data: newOrder,
//         message: `New Order has created`,
//       })
//       .status(200);
//   } catch (error) {
//     return response
//       .json({
//         status: false,
//         message: `There is an error. ${error}`,
//       })
//       .status(400);
//   }
// };

export const createOrder = async (request: Request, response: Response) => {
  try {
    /** get requested data (data has been sent from request) */
    const { pembayaran, detailTransaksi } = request.body;
    const uuid = uuidv4();

    /** validate the user input */
    const user = request.body.user;
    /** Collect unavailable hewan IDs */
    let total_price = 0;
    const unavailableHewan = [];

    for (let index = 0; index < detailTransaksi.length; index++) {
      const { hewanId } = detailTransaksi[index];

      // Check if the animal is available
      const detailHewan = await prisma.hewan.findFirst({
        where: {
          idHewan: hewanId,
          statusHewan: "TERSEDIA", // Ensure the animal is available
        },
      });

      if (!detailHewan) {
        unavailableHewan.push(hewanId);
      } else {
        total_price += detailHewan.harga;
      }
    }

    // If there are unavailable hewan, return error with detailed message
    if (unavailableHewan.length > 0) {
      return response.status(400).json({
        status: false,
        message: `Hewan yang diminta tidak ditemukan atau sudah terjual: ${unavailableHewan.join(
          ", "
        )}.`,
      });
    }

    /** process to save new order */
    const newOrder = await prisma.transaksi.create({
      data: {
        uuid,
        user: {
          connect: {
            idUser: user.id, // connect to existing user by id
          },
        },
        pembayaran,
        totalBayar: total_price,
      },
    });

    /** loop details of Order to save in database */
    for (let index = 0; index < detailTransaksi.length; index++) {
      const uuid = uuidv4();
      const { hewanId } = detailTransaksi[index];

      // Create detail transaksi
      await prisma.detailTransaksi.create({
        data: {
          uuid,
          idTransaksi: newOrder.idTransaksi,
          idHewan: Number(hewanId),
        },
      });

      // Update the status of the animal to 'HABIS'
      await prisma.hewan.update({
        where: { idHewan: hewanId },
        data: { statusHewan: "HABIS" },
      });
    }

    return response.status(200).json({
      status: true,
      data: newOrder,
      message: `New Order has been created.`,
    });
  } catch (error) {
    return response.status(400).json({
      status: false,
      message: `There is an error: ${error}`,
    });
  }
};

export const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { statusBayar } = req.body;

    const findOrder = await prisma.transaksi.findFirst({
      where: { idTransaksi: Number(id) },
    });
    if (!findOrder)
      return res.status(200).json({
        status: false,
        message: "Order tidak ditemukan",
      });

    const editedUser = await prisma.transaksi.update({
      data: {
        statusBayar: statusBayar || findOrder.statusBayar,
      },
      where: { idTransaksi: Number(id) },
    });

    return res
      .json({
        status: true,
        user: editedUser,
        message: "Order telah diupdate",
      })
      .status(200);
  } catch (error) {
    return res
      .json({
        status: false,
        message: `Terjadi sebuah kesalahan ${error}`,
      })
      .status(400);
  }
};

export const deleteOrder = async (request: Request, response: Response) => {
  try {
    /** get id of order's id that sent in parameter of URL */
    const { id } = request.params;

    /** make sure that data is exists in database */
    const findOrder = await prisma.transaksi.findFirst({
      where: { idTransaksi: Number(id) },
    });
    if (!findOrder)
      return response
        .status(200)
        .json({ status: false, message: `Order tidak ditemukan` });

    /** process to delete details of order */
    let deleteOrderList = await prisma.detailTransaksi.deleteMany({
      where: { idDetail: Number(id) },
    });
    /** process to delete of Order */
    let deleteOrder = await prisma.transaksi.delete({
      where: { idTransaksi: Number(id) },
    });

    return response
      .json({
        status: true,
        data: deleteOrder,
        message: `Order has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};
