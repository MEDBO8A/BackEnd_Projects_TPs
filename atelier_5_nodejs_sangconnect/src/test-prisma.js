import prisma from "./database/prisma.js";

const getDonneur = await prisma.donneurs.findUnique({
    where: {
        id: 2
    }
});
const createDonneur = await prisma.donneurs.create({
    data: {
        nom: "Khelifi",
        prenom: "Yassine",
        groupeSanguin: "AB+"
    }
});
const updateDonneur = await prisma.donneurs.update({
    where: {
        id: 1
    },
    data: {
        nom: "Ben Salem"
    }
});

await prisma.donneurs.delete({
    where: {
        id: 1
    }
});

console.log(getDonneur);
console.log(createDonneur);
console.log(updateDonneur);

await prisma.$disconnect();