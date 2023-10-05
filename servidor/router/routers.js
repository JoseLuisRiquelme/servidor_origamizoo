const express = require("express");
const router = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { getPubli, postPublicacion, getReviews,
    crearUsuario, usuarioLogin, getFavoritos,
    setFavoritos, getUsuario, deleteFavoritos,
    getUsuarioPublic, getEditPubli, putEditPubli,
    postReviews, deletePublicacion, getPublicaciones } = require("../consultas");
const checkCredentialsMiddleware = require("../middlewares/middlewares");
require("dotenv").config();
const secretkey = process.env.SECRET_KEY;

// Middleware
router.use(express.json());
router.use(cors());

//Routes
router.get("/publicaciones", async (req, res) => {
    try {
        const productos = await getPubli();
        res.json(productos);
    } catch (error) {
        res.send(error)
    }
})

router.get("/publicacionesPromoted", async (req, res) => {
    try {
        const produtcs = await getPublicaciones();
        res.json(produtcs);
    } catch (error) {
        res.send(error)
    }
})

router.post("/publicaciones", async (req, res) => {
    try {
        const{data}=req.body
        const { id_usuario, titulo, descripcion, stock, precio, fecha_publicacion, img } = data;
        const productos = await postPublicacion(id_usuario, titulo, descripcion, stock, precio, fecha_publicacion, img);
        res.json({ datos: productos, message: "datos agregados correctamente" });
    } catch (error) {
        console.log({ error: error, message: "no se agrego  a publicaciones" })
    }
})

router.get("/publicaciones/usuario/:id_user", async (req, res) => {
    try {
        const {id_user} = req.params;
        const userProducts = await getUsuarioPublic(id_user);
        res.json(userProducts);
    } catch (error) {
        console.log(error)
    }
})

router.get("/usuario/:userId/publicacion/:itemId", async (req, res) => {
    try {
        const {userId, itemId} = req.params;
        const edictProduct = await getEditPubli(userId, itemId)
        res.json(edictProduct);
    } catch (error) {
        res.send(error)
    }
})

router.put("/usuario/:userId/publicacion/:itemId", async (req, res) => {
    try {
        const {userId, itemId} = req.params;
        const {titulo, descripcion, stock, precio, img} = req.body;
        const edictProduct = putEditPubli(userId, itemId, titulo, descripcion, stock, precio, img);
        res.json({message: "publicacion editada  correctamente" });
    } catch (error) {
        console.log(error)
    }
})

router.delete("/publicaciones/:itemId", async(req, res) => {
    try {
        const {itemId} = req.params
        await deletePublicacion(itemId);
        res.json({message: "publicacion eliminada correctamente" });
    } catch (error) {
        res.send(error)
    }
})

router.get("/comentarios/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const comentarios = await getReviews(id);
        res.send(comentarios)
    } catch (error) {
        res.send(error)
    }
})

router.post("/comentarios/:itemId", async(req, res) => {
    try {
        const {itemId} = req.params;
        const {userId, comentario} = req.body;
        postReviews(itemId, userId, comentario);
        res.json({  message: "comentarios agregados correctamente" });
    } catch (error) {
        res.send(error)
    }
})

router.post("/login", checkCredentialsMiddleware, async (req, res) => {
    try {
        const user = req.body;
        const { email, password } = user;
        await usuarioLogin(email, password);
        const token = jwt.sign({ email }, secretkey, { expiresIn: "1h" });
        res.send(token);
    } catch (error) {
        res.status(error.code || 500).send({ message: "Error al intentar Logear", details: error.message });
    }
})

router.get("/user", async (req, res) => {
    try {
        const token = req.header("Authorization").split("Bearer ")[1];
        const { email } = jwt.decode(token);
        const usuario = await getUsuario(email);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" })
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post("/register", async (req, res) => {
    try {
        const { nombre, email, contrasena, direccion, ciudad, telefono, fecha_registro } = req.body;
        console.log(req.body)
        await crearUsuario(nombre, email, contrasena, direccion, ciudad, telefono, fecha_registro);
        res.json({ mensaje: "Usuario creado exitosamente" });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

router.get("/favoritos/usuario/:idUsuario", async (req, res) => {
    const id_usuarios = req.params.idUsuario;
    const favoritos = await getFavoritos(id_usuarios);
    res.send(favoritos);
});

router.post("/favoritos", async (req, res) => {
    try {
        const { idUser, idProduct } = req.body;
        await setFavoritos(idUser, idProduct);
        return res.send("Datos agregados correctamente")
    } catch (error) {
        console.log(error)
    }
});

router.delete("/usuario/:idUser/publicacion/:idProduct", async (req, res) => {
    try {
        const { idUser, idProduct } = req.params;
        await deleteFavoritos(idUser, idProduct);
        return res.send("Datos eliminados correctamente")
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
