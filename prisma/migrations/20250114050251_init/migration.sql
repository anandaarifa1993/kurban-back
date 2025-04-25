-- CreateTable
CREATE TABLE `user` (
    `idUser` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `nama` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL DEFAULT '',
    `password` VARCHAR(191) NOT NULL DEFAULT '',
    `hp` VARCHAR(191) NOT NULL DEFAULT '',
    `alamat` TEXT NOT NULL DEFAULT '',
    `profile` VARCHAR(191) NOT NULL DEFAULT '',
    `role` ENUM('Pelanggan', 'Penjual') NOT NULL DEFAULT 'Pelanggan',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_uuid_key`(`uuid`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`idUser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hewan` (
    `idHewan` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `berat` VARCHAR(191) NOT NULL DEFAULT '',
    `umur` INTEGER NOT NULL DEFAULT 0,
    `harga` INTEGER NOT NULL DEFAULT 0,
    `kategori` ENUM('SAPI', 'KAMBING') NOT NULL DEFAULT 'SAPI',
    `deskripsi` TEXT NOT NULL DEFAULT '',
    `foto` VARCHAR(191) NOT NULL DEFAULT '',
    `statusHewan` ENUM('TERSEDIA', 'HABIS') NOT NULL DEFAULT 'TERSEDIA',
    `idPenjual` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `hewan_uuid_key`(`uuid`),
    PRIMARY KEY (`idHewan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `idTransaksi` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `totalBayar` INTEGER NOT NULL DEFAULT 0,
    `statusBayar` ENUM('NEW', 'PAID', 'DONE') NOT NULL DEFAULT 'NEW',
    `pembayaran` ENUM('TRANSFER', 'COD') NOT NULL DEFAULT 'TRANSFER',
    `idUser` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaksi_uuid_key`(`uuid`),
    PRIMARY KEY (`idTransaksi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detailTransaksi` (
    `idDetail` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `idTransaksi` INTEGER NULL,
    `idHewan` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `detailTransaksi_uuid_key`(`uuid`),
    PRIMARY KEY (`idDetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hewan` ADD CONSTRAINT `hewan_idPenjual_fkey` FOREIGN KEY (`idPenjual`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `user`(`idUser`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_idTransaksi_fkey` FOREIGN KEY (`idTransaksi`) REFERENCES `transaksi`(`idTransaksi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detailTransaksi` ADD CONSTRAINT `detailTransaksi_idHewan_fkey` FOREIGN KEY (`idHewan`) REFERENCES `hewan`(`idHewan`) ON DELETE SET NULL ON UPDATE CASCADE;
