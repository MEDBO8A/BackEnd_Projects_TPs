import * as donRepository
    from "../repositories/don.repository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

function buildFilters(query) {

    const page = Number(query.page || DEFAULT_PAGE);
    const limit = Number(query.limit || DEFAULT_LIMIT);

    return {
        centreId: query.centreId,
        donneurId: query.donneurId,
        ville: query.ville,
        groupeSanguin: query.groupeSanguin,
        sortBy: query.sortBy || "dateDon",
        order: query.order || "desc",
        page: page,
        limit: limit,
        skip: (page - 1) * limit
    };
}

export async function getAll(query = {}) {

    const filters = buildFilters(query);

    const dons = await donRepository.findAll(filters);

    const total = await donRepository.count(filters);

    return {
        data: dons,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total: total
        }
    };
}

export async function getById(id) {

    const don = await donRepository.findById(id);

    if (!don) {

        const error = new Error("Don introuvable");

        error.statusCode = 404;

        throw error;
    }

    return don;
}

export async function getByDonneur(donneurId) {

    return donRepository.findByDonneur(donneurId);
}

export async function create(data) {

    return donRepository.create(data);
}

export async function update(id, data) {

    await getById(id);

    return donRepository.update(id, data);
}

export async function patch(id, data) {

    await getById(id);

    return donRepository.update(id, data);
}

export async function remove(id) {

    await getById(id);

    await donRepository.remove(id);
}
