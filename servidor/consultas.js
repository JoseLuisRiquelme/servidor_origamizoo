const pool = require("./server");
const bcrypt = require("bcryptjs");

const getPubli = async () => {
    const query = "SELECT publicaciones.*, usuarios.nombre FROM publicaciones INNER JOIN usuarios ON publicaciones.id_usuario = usuarios.id";
    const { rows: products } = await pool.query(query);
    return products
}

const getPublicaciones = async () => {
    const query = "SELECT * from publicaciones LIMIT 20";
    const {rows: products} = await pool.query(query);
    return products;
}

const deletePublicacion = async (itemId) => {
    try {
        const query = "Delete FROM publicaciones WHERE id = $1";
        const values = [itemId]
        const result = await pool.query(query, values)
        return result;
    } catch (error) {
        console.log(error);
    }
}

const postPublicacion = async (id_usuario, titulo, descripcion, stock, precio, fecha_publicacion, img) => {
    try {
        const query = "INSERT INTO publicaciones(id_usuario, titulo, descripcion, stock, precio, fecha_publicacion, img) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        const values = [id_usuario, titulo, descripcion, stock, precio, fecha_publicacion, img];
        await pool.query(query, values);
    } catch (error) {
        console.log({ error: error, message: "ocurrio un problema al ingresar los datos en la tabla PUBLICACIONES" });
    }
}

const getUsuarioPublic = async (id_user) => {
    try {
        const query = "SELECT * from publicaciones WHERE id_usuario = $1";
        const values = [id_user];
        const { rows: userProducts } = await pool.query(query, values);
        return userProducts;
    } catch (error) {
        console.log(error)
    }
}

const getEditPubli = async (userId, itemId) => {
    try {
        const query = "SELECT * FROM publicaciones WHERE id = $2 AND id_usuario = $1";
        const values = [userId, itemId];
        const { rows: editProduct } = await pool.query(query, values);
        return editProduct
    } catch (error) {
        console.log(error)
    }
}

const putEditPubli = async (userId, itemId, titulo, descripcion, stock, precio, url) => {
    try {
        const query = "UPDATE publicaciones SET titulo = $3, descripcion = $4, stock = $5, precio = $6, img = $7 WHERE id = $2 AND id_usuario = $1"
        const values = [userId, itemId, titulo, descripcion, stock, precio, url]
        const { rows: newProduct } = await pool.query(query, values);
        return newProduct;
    } catch (error) {
        console.log(error)
    }
}

const getReviews = async (id) => {
    const query = "SELECT usuarios.nombre, comentarios.contenido FROM comentarios INNER JOIN usuarios ON comentarios.id_usuario = usuarios.id  WHERE id_publicacion = $1";
    const values = [id];
    const { rows: comentarios } = await pool.query(query, values);
    return comentarios
}

const postReviews = async (itemId, userId, comentario) => {
    try {
        const query = "INSERT INTO comentarios (id_publicacion, id_usuario, contenido) VALUES($1, $2, $3)"
        const values = [itemId, userId, comentario];
        const { rows: review } = await pool.query(query, values);
        return review
    } catch (error) {
        console.log(error)
    }
}

const usuarioLogin = async (email, password) => {
    const values = [email];
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const { rows: [usuario], rowCount } = await pool.query(query, values);
    if (!usuario) {
        throw { code: 401, message: "email invalido" };
    } else {
        const { contrasena: passwordEcrypted } = usuario;
        const passwordValided = bcrypt.compareSync(password, passwordEcrypted);
        console.log(password)
        console.log(passwordEcrypted)
        if (passwordValided) {
            return usuario
        } else {
            if (!passwordValided || !rowCount)
                throw { code: 401, message: "email o contrasena incorrecta" };
        }
    }
}

const crearUsuario = async (nombre, email, contrasena, direccion, ciudad, telefono, fecha_registro) => {
    const passwordEcrypted = bcrypt.hashSync(contrasena, 10);
    contrasena = passwordEcrypted;
    const query = "INSERT INTO usuarios (nombre, email, contrasena, direccion, ciudad, telefono, fecha_registro) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const values = [nombre, email, passwordEcrypted, direccion, ciudad, telefono, fecha_registro];
    const { rows: userCreted } = await pool.query(query, values);
    return userCreted;
}

const getFavoritos = async (id_usuarios) => {
    const query = "SELECT publicaciones.img, publicaciones.titulo, publicaciones.precio, publicaciones.id FROM publicaciones INNER JOIN favoritos ON publicaciones.id = favoritos.id_publicaciones INNER JOIN usuarios ON usuarios.id = favoritos.id_usuarios WHERE id_usuarios = $1"
    const values = [id_usuarios];
    const { rows: favoritos } = await pool.query(query, values);
    return favoritos
}

const getUsuario = async (email) => {
    try {
        const query = "SELECT id, nombre, email, direccion, ciudad, telefono FROM usuarios WHERE email = $1";
        const values = [email];
        const { rows: user } = await pool.query(query, values)
        return user;
    } catch (error) {
        console.log("Error al obtener usuario")
    }
}

const setFavoritos = async (idUser, idProduct) => {
    try {
        const query = "INSERT INTO favoritos VALUES(DEFAULT, $1, $2)";
        const values = [idUser, idProduct];
        const { rowCount } = await pool.query(query, values);
    } catch (error) {
        console.log("No se pudo agregar datos solicitados")
    }
}

const deleteFavoritos = async (idUser, idProduct) => {
    try {
        const query = "DELETE FROM favoritos WHERE id_usuarios = $1 AND id_publicaciones = $2";
        const values = [idUser, idProduct];
        const { rowCount } = await pool.query(query, values);
    } catch (error) {
        console.log("No se encontraron datos para mostrar")
    }
}

module.exports = {
    
    getPublicaciones,
    deleteFavoritos,
    postPublicacion,
    getReviews,
    usuarioLogin,
    crearUsuario,
    getUsuarioPublic,
    getFavoritos,
    getPubli,
    getUsuario,
    setFavoritos,
    deletePublicacion,
    getEditPubli,
    putEditPubli,
    postReviews,  
}