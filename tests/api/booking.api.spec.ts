import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import bookingSchema from '../../data/booking-schema.json';
import bookingData from '../../data/booking-data.json';

const ajv = new Ajv();

test.describe('E2E API Workflows', () => {

    test('Crear Reserva y Verificar Persistencia (POST + GET)', async ({ request }) => {
        // Usamos los datos de nuestro archivo JSON
        const payload = bookingData.validBooking;

        // 1. CREAR (POST) - Validamos que el servidor reciba la info
        const postResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: payload
        });
        
        expect(postResponse.status(), 'El POST debería retornar 200').toBe(200);
        const postBody = await postResponse.json();
        const bookingId = postBody.bookingid;

        // 2. VALIDAR CONTRATO DEL POST (Integridad)
        const validate = ajv.compile(bookingSchema);
        expect(validate(postBody), 'El esquema del POST es inválido').toBe(true);

        // 3. CONSULTAR (GET) - Validamos que los datos se guardaron bien (Precisión)
        // Concatenamos el ID obtenido dinámicamente
        const getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
        
        expect(getResponse.status(), 'El GET debería retornar 200').toBe(200);
        const getBody = await getResponse.json();

        // LA PRUEBA DE FUEGO DE PRECISIÓN:
        // Comparamos el cuerpo del GET directamente contra nuestro payload original
        expect(getBody, 'Los datos recuperados del servidor no coinciden con los enviados').toMatchObject(payload);
        
        console.log(`✅ Flujo completado: Reserva ${bookingId} creada y verificada con éxito.`);
    });
});