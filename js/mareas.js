// Datos correctos de las mareas para hoy
const mareasHoy = [
    { hora: '01:15', tipo: 'P', altura: '3,358' },
    { hora: '07:38', tipo: 'B', altura: '1,398' },
    { hora: '14:02', tipo: 'P', altura: '3,304' },
    { hora: '20:01', tipo: 'B', altura: '1,440' }
];

// Función para mostrar las mareas
function mostrarMareas() {
    try {
        const mareasContainer = document.getElementById('mareas');
        
        let mareasHTML = '<h3 class="text-lg font-semibold mb-2">Mareas hoy</h3>';
        
        mareasHoy.forEach(marea => {
            mareasHTML += `
                <div class="mb-2">
                    <span class="font-medium">${marea.hora}</span>
                    <span class="ml-2">${marea.tipo === 'P' ? 'Pleamar' : 'Bajamar'}</span>
                    <span class="ml-2">${marea.altura} m</span>
                </div>
            `;
        });
        
        mareasContainer.innerHTML = mareasHTML;
        
    } catch (error) {
        console.error('Error al mostrar las mareas:', error);
        document.getElementById('mareas').innerHTML = `
            <h3 class="text-lg font-semibold mb-2">Mareas</h3>
            <p class="text-gray-600">Error al cargar los datos</p>
        `;
    }
}

// Mostrar mareas al cargar la página
document.addEventListener('DOMContentLoaded', mostrarMareas); 