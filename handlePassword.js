const bcryptjs =require('bcryptjs');

//Funcion para cifrar una contraseña
const encrypt = async (clearPassword) =>{
    const hash = await bcrypt.hash(clearPassword, salt); // Ciframos la contraseña
    return hash; // Retornamos la contraseña cifrada
}

// Función para comparar una contraseña con su hash almacenado
const compare = async (clearPassword, hashedPassword) => {
    return await bcrypt.compare(clearPassword, hashedPassword);
};

module.exports = { encrypt, compare };