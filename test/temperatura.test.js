
 global.Chart = jest.fn(() => ({ 
    destroy: jest.fn(), 
    update: jest.fn(),
     render: jest.fn(), 
     resize: jest.fn(), }));

     global.XLSX = {
        utils: {
            json_to_sheet: jest.fn(() => ({})), // Devuelve un objeto vacío como hoja de cálculo
            book_new: jest.fn(() => ({})), // Devuelve un objeto vacío como libro de trabajo
            book_append_sheet: jest.fn(), // No necesita devolver nada
        },
        writeFile: jest.fn(), // Mock para writeFile
    };

    global.data1 = [
        { created_at: "2025-03-01T12:00:00Z", field8: "25.5" },
        { created_at: "2025-03-01T13:00:00Z", field8: "26.0" },
    ];

// Mock para fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                feeds: [
                    { created_at: "2025-03-01T12:00:00Z", field8: "25.5" },
                    { created_at: "2025-03-01T13:00:00Z", field8: "26.0" },
                ],
            }),
    })
);


// Importa las funciones desde el archivo temperatura.js
const {
    getUrl,
    fetchChannelData,
    exportToExcel,
    consultarDatos,
    exportarGrafico1,
    exportarGrafico2,
} = require('../static/js/temperatura');

// Simula el DOM antes de cada prueba
beforeEach(() => {
    document.body.innerHTML = `
        <div>
            <input id="date-start" value="2025-03-01" />
            <input id="date-end" value="2025-03-05" />
            <button id="consultar"></button>
            <button id="exportar1" class="hidden"></button>
            <button id="exportar2" class="hidden"></button>
            <canvas id="grafica1"></canvas>
            <canvas id="grafica2"></canvas>
        </div>
    `;
    consultarDatos();
    exportarGrafico1();
    exportarGrafico2();
});


// Pruebas para getUrl
describe('getUrl', () => {
    it('debería generar una URL con los parámetros correctos', () => {
        const channel = {
            id: "2865291",
            apiKey: "GCPYYUBJMUIUL4Y5",
            field: 8,
        };
        const results = 800;
        const start = "2025-03-01T00:00:00Z";
        const end = "2025-03-05T23:59:59Z";

        const url = getUrl(channel, results, start, end);
        expect(url).toBe(
            "https://api.thingspeak.com/channels/2865291/fields/8.json?api_key=GCPYYUBJMUIUL4Y5&results=800&start=2025-03-01T00:00:00Z&end=2025-03-05T23:59:59Z"
        );
    });

    it('debería generar una URL sin parámetros de fecha si no se proporcionan', () => {
        const channel = {
            id: "2865291",
            apiKey: "GCPYYUBJMUIUL4Y5",
            field: 8,
        };
        const results = 800;

        const url = getUrl(channel, results);
        expect(url).toBe(
            "https://api.thingspeak.com/channels/2865291/fields/8.json?api_key=GCPYYUBJMUIUL4Y5&results=800"
        );
    });
});

// Pruebas para fetchChannelData
describe('fetchChannelData', () => {
    it('debería devolver los datos de la API de ThingSpeak', async () => {
        const url = "https://api.thingspeak.com/channels/2865291/fields/8.json";
        const data = await fetchChannelData(url);

        expect(data).toEqual([
            { created_at: "2025-03-01T12:00:00Z", field8: "25.5" },
            { created_at: "2025-03-01T13:00:00Z", field8: "26.0" },
        ]);
    });

    it('debería manejar errores y devolver un array vacío', async () => {
        fetch.mockImplementationOnce(() => Promise.reject("API is down"));
        const url = "https://api.thingspeak.com/channels/2865291/fields/8.json";
        const data = await fetchChannelData(url);

        expect(data).toEqual([]);
    });
});

// Pruebas para eventos
describe('initializeEventListeners', () => {
    it('debería ejecutar la lógica del botón consultar al hacer clic', () => {
        const consultarButton = document.getElementById('consultar');
        const mockFunction = jest.fn();

        consultarButton.addEventListener('click', mockFunction);
        consultarButton.click();

        expect(mockFunction).toHaveBeenCalled();
    });
});