const centres = [
  {
    id: 1,
    nom: "Centre de transfusion de Tunis",
    ville: "Tunis"
  },
  {
    id: 2,
    nom: "Centre régional de Sousse",
    ville: "Sousse"
  },
  {
    id: 3,
    nom: "Centre régional de Sfax",
    ville: "Sfax"
  }
];

export function getAll() {
    return centres;
}

export function getById(id) {
    return centres.find(centre => centre.id === id);
}

export function create(data) {
    const newcentre = {
        id: centres.length > 0 ? centres[centres.length - 1].id + 1 : 1,
        nom: data.nom,
        ville: data.ville,
    };
    centres.push(newcentre);
    return newcentre;
}

export function update(id, data) {
    const centre = getById(id);
    if (!centre) return null;

    centre.nom = data.nom;
    centre.ville = data.ville;
    return centre;
}

export function patch(id, data) {
    const centre = getById(id);
    if (!centre) return null;

    if (data.nom !== undefined) centre.nom = data.nom;
    if (data.ville !== undefined) centre.ville = data.ville;
    return centre;
}

export function remove(id) {
    const index = centres.findIndex(centre => centre.id === id);
    if (index === -1) return false;

    centres.splice(index, 1);
    return true;
}