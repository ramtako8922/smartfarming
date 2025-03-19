// Configura los detalles de tu canal de ThingSpeak
const channel1 = {
    id: "2865291", // ID del canal 1
    apiKey: "GCPYYUBJMUIUL4Y5", // Clave API del canal 1
    field: 4
};

const channel2 = {
    id: "2865282", // ID del canal 2
    apiKey: "NPFXILODVJGZOXH2", // Clave API del canal 2
    field: 4
};

const getUrl = (channel) => `https://api.thingspeak.com/channels/${channel.id}/feeds.json?api_key=${channel.apiKey}&results=400`;

async function fetchChannelData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.feeds;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return [];
    }
}

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
                        text: 'Carbono (ppm)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}

// Función para filtrar los datos según la fecha seleccionada
function filterDataByDate(feeds, selectedDate) {
    return feeds.filter(feed => {
        const feedDate = new Date(feed.created_at).toISOString().split('T')[0];
        return feedDate === selectedDate;
    });
}
document.getElementById('consultar').addEventListener('click', async () => {
    const selectedDate = document.getElementById('date-start').value;

    if (selectedDate) {
        const [data1, data2] = await Promise.all([
            fetchChannelData(getUrl(channel1)),
            fetchChannelData(getUrl(channel2))
        ]);

        const filteredData1 = filterDataByDate(data1, selectedDate);
        const filteredData2 = filterDataByDate(data2, selectedDate);

        if (filteredData1.length > 0 || filteredData2.length > 0) {
            const labels1 = filteredData1.map(feed => new Date(feed.created_at).toLocaleTimeString());
            const values1 = filteredData1.map(feed => parseFloat(feed[`field${channel1.field}`]));
            renderChart('grafica1', labels1, values1, 'Galpon 1', 'green');

            const labels2 = filteredData2.map(feed => new Date(feed.created_at).toLocaleTimeString());
            const values2 = filteredData2.map(feed => parseFloat(feed[`field${channel2.field}`]));
            renderChart('grafica2', labels2, values2, 'Galpon 2', 'green');
        } else {
            alert('No hay datos disponibles para la fecha seleccionada.');
        }
    } else {
        alert('Por favor, selecciona una fecha válida.');
    }
});
