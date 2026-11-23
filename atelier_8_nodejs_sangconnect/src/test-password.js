import {
    hashPassword,
    verifyPassword
} from "./utils/password.js";

const hash = await hashPassword("MotDePasse123");

console.log(hash);

const correct = await verifyPassword(
    hash,
    "MotDePasse123"
);

const incorrect = await verifyPassword(
    hash,
    "AutreMotDePasse"
);

console.log(correct);
console.log(incorrect);
