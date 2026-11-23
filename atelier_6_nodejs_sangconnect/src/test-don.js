import prisma from "./database/prisma.js";

// Activité 5 — créer un don
const don = await prisma.don.create({
    data: {
        volume: 450,
        donneurId: 1,
        centreId: 1
    }
});

console.log("Don créé :");
console.log(don);

// Activité 6 — récupérer les dons avec les données liées
const dons = await prisma.don.findMany({
    include: {
        donneur: true,
        centre: true
    }
});

console.log("Tous les dons :");
console.log(dons);

await prisma.$disconnect();
