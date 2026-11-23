import prisma from "./database/prisma.js";

async function main() {

    // Activité 4 — créer quelques centres
    const centre1 = await prisma.centre.create({
        data: {
            nom: "Centre régional de Sousse",
            ville: "Sousse"
        }
    });

    const centre2 = await prisma.centre.create({
        data: {
            nom: "Centre régional de Tunis",
            ville: "Tunis"
        }
    });

    const centre3 = await prisma.centre.create({
        data: {
            nom: "Centre régional de Sfax",
            ville: "Sfax"
        }
    });

    // On récupère un donneur, ou on en crée un pour le test
    let donneur = await prisma.donneur.findFirst();

    if (!donneur) {
        donneur = await prisma.donneur.create({
            data: {
                nom: "Ben Ali",
                prenom: "Ahmed",
                groupeSanguin: "A+"
            }
        });
    }

    // Activité 11 — créer plusieurs dons liés
    await prisma.don.create({
        data: {
            volume: 450,
            donneurId: donneur.id,
            centreId: centre1.id
        }
    });

    await prisma.don.create({
        data: {
            volume: 450,
            donneurId: donneur.id,
            centreId: centre2.id
        }
    });

    await prisma.don.create({
        data: {
            volume: 500,
            donneurId: donneur.id,
            centreId: centre1.id
        }
    });

    console.log("Données de test créées.");
}

main()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
