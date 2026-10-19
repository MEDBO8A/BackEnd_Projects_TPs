let donneurs = [
    {
        id: 1,
        nom: "Ben Salem",
        prenom: "Ahmed",
        groupeSanguin: "A+"
    },
    {
        id: 2,
        nom: "Trabelsi",
        prenom: "Sami",
        groupeSanguin: "O+"
    },
    {
        id: 3,
        nom: "Mansouri",
        prenom: "Amine",
        groupeSanguin: "B+"
    }
];

export function getAll() {
    return donneurs;
}

export function getById(id) {
    return donneurs.find(donneur => donneur.id === id);
}

export function create(data) {
    const newDonneur = {
        id: donneurs.length > 0 ? donneurs[donneurs.length - 1].id + 1 : 1,
        nom: data.nom,
        prenom: data.prenom,
        groupeSanguin: data.groupeSanguin
    };
    donneurs.push(newDonneur);
    return newDonneur;
}

export function update(id, data) {
    const donneur = getById(id);
    if (!donneur) return null;

    donneur.nom = data.nom;
    donneur.prenom = data.prenom;
    donneur.groupeSanguin = data.groupeSanguin;
    return donneur;
}

export function patch(id, data) {
    const donneur = getById(id);
    if (!donneur) return null;

    if (data.nom !== undefined) donneur.nom = data.nom;
    if (data.prenom !== undefined) donneur.prenom = data.prenom;
    if (data.groupeSanguin !== undefined) donneur.groupeSanguin = data.groupeSanguin;
    return donneur;
}

export function remove(id) {
    const index = donneurs.findIndex(donneur => donneur.id === id);
    if (index === -1) return false;

    donneurs.splice(index, 1);
    return true;
}