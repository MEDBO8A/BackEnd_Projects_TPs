import prisma from "../database/prisma.js";

export function findByEmail(email) {
    return prisma.user.findUnique({
        where: {
            email: email
        }
    });
}

export function findById(id) {
    return prisma.user.findUnique({
        where: {
            id: id
        }
    });
}

export function findAll() {
    return prisma.user.findMany();
}

export function create(data) {
    return prisma.user.create({
        data: data
    });
}

export function update(id, data) {
    return prisma.user.update({
        where: {
            id: id
        },
        data: data
    });
}

export function remove(id) {
    return prisma.user.delete({
        where: {
            id: id
        }
    });
}
