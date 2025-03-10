document.getElementById('consultar').addEventListener('click', function() {
    const startDate = document.getElementById('date-start').value;
    const endDate = document.getElementById('date-end').value;

    if (startDate && endDate) {
        const labels = generateDateRange(startDate, endDate);
        const data = generateRandomTemperatures(labels.length);

        const ctx = document.getElementById('temperatureChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura Promedio',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: true,
                            text: 'Fechas'
                        }
                    },
                    y: {
                        beginAtZero: true
                        , title: {
                            display: true,
                            text: 'Temperatura (°C)'
                        }
                    }
                }
            }
        });
    } else {
        alert('Por favor, selecciona un rango de fechas.');
    }
});

function generateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    let currentDate = start;

    while (currentDate <= end) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

function generateRandomTemperatures(numDays) {
    const temperatures = [];
    for (let i = 0; i < numDays; i++) {
        temperatures.push(Math.floor(Math.random() * 30) + 10); // Temperaturas aleatorias entre 10 y 40 grados
    }
    return temperatures;
}