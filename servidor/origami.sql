-- Crea la base de datos origamiDB
CREATE DATABASE origamiDB;
-- Conectarse a la base de datos de origamiDB
\c origamiDB

-- Crea tabla Categorias
CREATE TABLE Categorias (id SERIAL PRIMARY KEY,nombre VARCHAR(100));

-- Crea tabla Publicaciones
CREATE TABLE Publicaciones (id SERIAL PRIMARY KEY,id_usuario INT REFERENCES Usuarios(id),titulo VARCHAR(200),descripcion TEXT,stock INT,precio INT,fecha_publicacion TIMESTAMP,img VARCHAR(100)
);
-- Crea tabla Usuarios
CREATE TABLE Usuarios (id SERIAL PRIMARY KEY,nombre VARCHAR(100),email VARCHAR(100),contrasena VARCHAR(100),direccion VARCHAR(200),ciudad VARCHAR(50),telefono VARCHAR(20),fecha_registro DATE
);

-- Crea tabla Carrito_de_Compras
CREATE TABLE Carrito_de_Compras (id SERIAL PRIMARY KEY,id_usuario INT REFERENCES Usuarios(id),id_publicacion INT REFERENCES Publicaciones(id),cantidad INT);
-- Crea tabla Imagenes
CREATE TABLE Imagenes (id SERIAL PRIMARY KEY,id_publicacion INT REFERENCES Publicaciones(id),url VARCHAR(200));

-- Crea tabla Pedidos
CREATE TABLE Pedidos (id SERIAL PRIMARY KEY,id_usuario INT REFERENCES Usuarios(id),fecha TIMESTAMP,estado VARCHAR(50));

-- Crea tabla Detalle_del_Pedido
CREATE TABLE Detalle_del_Pedido (id SERIAL PRIMARY KEY,id_pedido INT REFERENCES Pedidos(id),id_publicacion INT REFERENCES Publicaciones(id),cantidad INT,precio_unitario INT);

-- Crea tabla Envios
CREATE TABLE Envios (id SERIAL PRIMARY KEY,id_transaccion INT REFERENCES Pedidos(id), direccion VARCHAR(200),ciudad VARCHAR(50));

-- Crea tabla Pagos
CREATE TABLE Pagos (id SERIAL PRIMARY KEY,id_transaccion INT REFERENCES Pedidos(id),metodo_pago VARCHAR(50),monto INT,fecha TIMESTAMP);

-- Crea tabla Comentarios
CREATE TABLE Comentarios (id SERIAL PRIMARY KEY,id_publicacion INT REFERENCES Publicaciones(id),id_usuario INT REFERENCES Usuarios(id),contenido TEXT,fecha TIMESTAMP);

-- Crea tabla Valoraciones
CREATE TABLE Valoraciones (id SERIAL PRIMARY KEY,id_publicacion INT REFERENCES Publicaciones(id),id_usuario INT REFERENCES Usuarios(id),valoracion INT,fecha TIMESTAMP);

-- Crea tabla Publicaciones_Categorias (Tabla intermedia)
CREATE TABLE Publicaciones_Categorias (id SERIAL PRIMARY KEY,id_publicacion INT REFERENCES Publicaciones(id),id_categoria INT REFERENCES Categorias(id));

-- Crea tabla de Favoritos
CREATE TABLE favoritos (id SERIAL PRIMARY KEY,id_usuarios INT,id_publicaciones INT,FOREIGN KEY (id_usuarios) REFERENCES usuarios(id),FOREIGN KEY (id_publicaciones) REFERENCES publicaciones(id));
