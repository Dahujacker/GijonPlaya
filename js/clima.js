// Función para obtener la dirección del viento en texto
function getDireccionViento(grados) {
    const direcciones = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
    const indice = Math.round(grados / 22.5) % 16;
    return direcciones[indice];
}

// Función para obtener el emoji del clima
function getClimaEmoji(temperatura, precipitacion, nubosidad) {
    if (precipitacion > 0) return '🌧️';
    if (nubosidad > 80) return '☁️';
    if (nubosidad > 40) return '⛅';
    return '☀️';
}

// Función para actualizar el fondo según el clima
function actualizarFondoClima(precipitacion, nubosidad) {
    const body = document.body;
    body.classList.remove('fondo-soleado', 'fondo-lluvia', 'fondo-nublado');
    
    if (precipitacion > 0) {
        body.classList.add('fondo-lluvia');
    } else if (nubosidad > 80) {
        body.classList.add('fondo-nublado');
    } else {
        body.classList.add('fondo-soleado');
    }
}

// Función para obtener y mostrar el clima
async function actualizarClima() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=43.5453&longitude=-5.6615&current=temperature_2m,precipitation,windspeed_10m,winddirection_10m,cloudcover');
        const data = await response.json();
        
        const { temperature_2m, precipitation, windspeed_10m, winddirection_10m, cloudcover } = data.current;
        
        // Actualizar el texto del clima
        const climaTexto = document.getElementById('clima-texto');
        const climaEmoji = document.getElementById('clima-emoji');
        
        if (climaTexto && climaEmoji) {
            const direccionViento = getDireccionViento(winddirection_10m);
            const emoji = getClimaEmoji(temperature_2m, precipitation, cloudcover);
            
            climaTexto.textContent = `${temperature_2m}°C, viento ${direccionViento} a ${Math.round(windspeed_10m)} km/h, ${
                cloudcover > 80 ? 'cielo nublado' : 
                cloudcover > 40 ? 'parcialmente nublado' : 
                'cielo despejado'
            }, ${precipitacion > 0 ? 'con lluvia' : 'sin lluvia'}`;
            
            climaEmoji.textContent = emoji;
        }
        
        // Actualizar el fondo
        actualizarFondoClima(precipitation, cloudcover);
        
    } catch (error) {
        console.error('Error al obtener el clima:', error);
    }
}

// Actualizar el clima cada 5 minutos
setInterval(actualizarClima, 5 * 60 * 1000);

// Actualizar el clima al cargar la página
document.addEventListener('DOMContentLoaded', actualizarClima); 