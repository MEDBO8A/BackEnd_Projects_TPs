import prisma from "../database/prisma.js";

// Les champs retournés pour un don : le don + le minimum du donneur et du centre
const donSelect = {
    id: true,
    dateDon: true,
    volume: true,
    donneurId: true,
    centreId: true,

    donneur: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            groupeSanguin: true
        }
    },

    centre: {
        select: {
            id: true,
            nom: true,
            ville: true
        }
    }
};

// Construit le "where" suivant les paramètres reçus dans l'URL
function buildWhere(filters) {

    const where = {};

    if (filters.centreId !== undefined) {
        where.centreId = filters.centreId;
    }

    if (filters.donneurId !== undefined) {
        where.donneurId = filters.donneurId;
    }

    if (filters.ville !== undefined) {
        where.centre = { ville: filters.ville };
    }

    if (filters.groupeSanguin !== undefined) {
        where.donneur = { groupeSanguin: filters.groupeSanguin };
    }

    return where;
}

export function findAll(filters = {}) {

    return prisma.don.findMany({
        where: buildWhere(filters),
        select: donSelect,
        orderBy: {
            [filters.sortBy || "dateDon"]: filters.order || "desc"
        },
        skip: filters.skip || 0,
        take: filters.limit || 10
    });
}

export function count(filters = {}) {

    return prisma.don.count({
        where: buildWhere(filters)
    });
}

export function findById(id) {

    return prisma.don.findUnique({
        where: {
            id: id
        },
        select: donSelect
    });
}

export function findByDonneur(donneurId) {

    return prisma.don.findMany({
        where: {
            donneurId: donneurId
        },
        include: {
            centre: true
        },
        orderBy: {
            dateDon: "desc"
        }
    });
}

export function create(data) {

    return prisma.don.create({
        data: data,
        select: donSelect
    });
}

export function update(id, data) {

    return prisma.don.update({
        where: {
            id: id
        },
        data: data,
        select: donSelect
    });
}

export function remove(id) {

    return prisma.don.delete({
        where: {
            id: id
        }
    });
}
