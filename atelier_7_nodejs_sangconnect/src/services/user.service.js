import * as userRepository
    from "../repositories/user.repository.js";

// On construit un objet public sans le mot de passe
function publicUser(user) {
    return {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

export async function getAll() {

    const users = await userRepository.findAll();

    return users.map(publicUser);
}

export async function getById(id) {

    const user = await userRepository.findById(id);

    if (!user) {

        const error = new Error(
            "Utilisateur introuvable"
        );

        error.statusCode = 404;

        throw error;
    }

    return publicUser(user);
}

export async function update(id, data) {

    await getById(id);

    const user = await userRepository.update(
        id,
        data
    );

    return publicUser(user);
}

export async function patch(id, data) {

    await getById(id);

    const user = await userRepository.update(
        id,
        data
    );

    return publicUser(user);
}

export async function remove(id) {

    await getById(id);

    await userRepository.remove(id);
}
