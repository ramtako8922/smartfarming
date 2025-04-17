// Variables globales para almacenar los datos de los gráficos
let data1 = [];
let data2 = [];

// Configura los detalles de tu canal de ThingSpeak
const channel1 = {
    id: "2865291", // ID del canal 1
    apiKey: "GCPYYUBJMUIUL4Y5", // Clave API del canal 1
    field: 8 // Campo del canal
};

const channel2 = {
    id: "2865282", // ID del canal 2
    apiKey: "NPFXILODVJGZOXH2", // Clave API del canal 2
    field: 8 // Campo del canal
};

// Genera la URL para la API de ThingSpeak
const getUrl = (channel, results = 8000, start = null, end = null) => {
    let url = `https://api.thingspeak.com/channels/${channel.id}/fields/${channel.field}.json?api_key=${channel.apiKey}&results=${results}`;
    if (start) url += `&start=${start}`;
    if (end) url += `&end=${end}`;
    return url;
};

// Función para obtener datos de un canal
async function fetchChannelData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.feeds || [];
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return [];
    }
}

// Renderiza la gráfica
function renderChart(canvasId, labels, data, label, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                borderColor: color,
                backgroundColor: 'rgba(0, 255, 179, 0.32)',
                borderWidth: 2,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: label
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Hora'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Temperatura (°C)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Evento para consultar datos y generar gráficas
async function consultarDatos() {
    const startDate = document.getElementById('date-start').value;
    const endDate = document.getElementById('date-end').value;

    if (startDate && endDate) {
        const formattedStartDate = startDate + 'T00:00:00Z';
        const formattedEndDate = endDate + 'T23:59:59Z';

        const url1 = getUrl(channel1, 800, formattedStartDate, formattedEndDate);
        const url2 = getUrl(channel2, 800, formattedStartDate, formattedEndDate);

        [data1, data2] = await Promise.all([
            fetchChannelData(url1),
            fetchChannelData(url2)
        ]);

        if (data1.length > 0 || data2.length > 0) {
            const labels1 = data1.map(feed => new Date(feed.created_at).toLocaleTimeString());
            const values1 = data1.map(feed => parseFloat(feed[`field${channel1.field}`]));
            renderChart('grafica1', labels1, values1, 'Galpón 1', 'green');

            const labels2 = data2.map(feed => new Date(feed.created_at).toLocaleTimeString());
            const values2 = data2.map(feed => parseFloat(feed[`field${channel2.field}`]));
            renderChart('grafica2', labels2, values2, 'Galpón 2', 'blue');

            // Mostrar los botones de exportar
            document.getElementById('exportar1').classList.remove('hidden');
            document.getElementById('exportar2').classList.remove('hidden');
        } else {
            alert('No hay datos disponibles para el rango de fechas seleccionado.');
        }
    } else {
        alert('Por favor, selecciona un rango de fechas válido.');
    }
}


// Función para exportar datos a Excel
function exportToExcel(data, filename) {
    console.log('Datos recibidos en exportToExcel:', data);
    const formattedData = data.map(feed => ({
        Fecha: new Date(feed.created_at).toLocaleString('es-ES', { hour12: true }).trim(),
        Temperatura: parseFloat(feed.field8),
    }));

    console.log('Datos formateados:', formattedData);

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, filename);
}

// Función para exportar los datos del gráfico 1
function exportarGrafico1() {
    const startDate = document.getElementById('date-start').value;
    const endDate = document.getElementById('date-end').value;

    if (startDate && endDate && data1.length > 0) {
        exportToExcel(data1, `Galpon1_${startDate}_a_${endDate}.xlsx`);
    } else {
        alert('No hay datos disponibles para exportar.');
    }
}

// Función para exportar los datos del gráfico 2
function exportarGrafico2() {
    const startDate = document.getElementById('date-start').value;
    const endDate = document.getElementById('date-end').value;

    if (startDate && endDate && data2.length > 0) {
        exportToExcel(data2, `Galpon2_${startDate}_a_${endDate}.xlsx`);
    } else {
        alert('No hay datos disponibles para exportar.');
    }
}



// Exporta las funciones que deseas probar
module.exports = {
    getUrl,
    fetchChannelData,
    exportToExcel,
    consultarDatos,
    exportarGrafico1,
    exportarGrafico2,
    
};