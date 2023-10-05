const request = require("supertest");

const app = require('../router/routers');

describe('Set de pruebas', () => {
    

    it('Ruta protegida /user: Enntrega un error 500', 
       async () => {
        const response = await request(app)
            .get('/user');

        expect(response.status).toBe(500);
    });

    it('GET /publicaciones: retornar una lista de productos', async () => {
        const response = await request(app).get('/publicaciones');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('Ruta /publicaciones/usuario/:id_user:Obtiene las publicaciones de un usuario', async () => {
        const userId = 2; 
        const response = await request(app)
          .get(`/publicaciones/usuario/${userId}`);
    
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0); 
      });

      it('Ruta /comentarios/:id: Debería obtener los comentarios de una publicación (especificar post ID)',
        async () => {
        const postId = 3; 
        const response = await request(app)
            .get(`/comentarios/${postId}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true); 
        expect(response.body.length).toBeGreaterThan(0); 
    });
});