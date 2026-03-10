const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'lib', 'server', 'db-actions.ts');
let content = fs.readFileSync(file, 'utf-8');

// Remove passwordHash from UserCredentialsSchema
content = content.replace(/passwordHash:\s*z\.string\(\),\n/g, "");

// Remove createUserWithCredentials, verifyUserCredentials, getUserCredentials, updateUserPassword
content = content.replace(/export const createUserWithCredentials =[\s\S]*?};\n\n/g, "");
content = content.replace(/export const verifyUserCredentials =[\s\S]*?};\n\n/g, "");
content = content.replace(/export const getUserCredentials =[\s\S]*?};\n\n/g, "");
content = content.replace(/export const updateUserPassword =[\s\S]*?};\n/g, "");

fs.writeFileSync(file, content, 'utf-8');
console.log('Fixed db-actions.ts');
