// Función principal que se ejecuta cuando se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    // Manejar tabs
    setupTabs();

    // Manejar navegación
    setupNavigation();

    // Configurar el cambio de tema claro/oscuro
    setupThemeToggle();
    
    // Configurar el botón de recarga para el widget de mareas
    setupReloadButtons();
});

// Configurar el sistema de tabs
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Desactivar todas las pestañas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar la pestaña seleccionada
            button.classList.add('active');
            document.getElementById(`${tab}-tab`).classList.add('active');
        });
    });
}

// Configurar la navegación inferior
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Implementar la navegación según el índice
            switch(index) {
                case 0: // Webcams
                    document.querySelector('.webcams-section').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 1: // Tiempo
                    document.querySelector('.weather-section').scrollIntoView({ behavior: 'smooth' });
                    document.querySelector('[data-tab="weather"]').click();
                    break;
                case 2: // Mareas
                    document.querySelector('.weather-section').scrollIntoView({ behavior: 'smooth' });
                    document.querySelector('[data-tab="tides"]').click();
                    break;
                case 3: // Viento
                    document.querySelector('.weather-section').scrollIntoView({ behavior: 'smooth' });
                    document.querySelector('[data-tab="wind"]').click();
                    break;
            }
        });
    });
}

// Configurar el botón de cambio de tema claro/oscuro
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    if (!themeToggle) {
        console.error('Botón de tema no encontrado');
        return;
    }
    
    // Comprobar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    
    // Aplicar el tema guardado o por defecto
    htmlElement.className = savedTheme;
    console.log('Tema aplicado:', savedTheme);
    
    // Añadir evento de clic al botón
    themeToggle.addEventListener('click', function() {
        console.log('Botón de tema pulsado');
        
        // Cambiar entre temas
        if (htmlElement.classList.contains('light-mode')) {
            console.log('Cambiando a modo oscuro');
            htmlElement.classList.remove('light-mode');
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
            
            // Actualizar los widgets que soportan tema oscuro
            updateWidgetsTheme('dark');
        } else {
            console.log('Cambiando a modo claro');
            htmlElement.classList.remove('dark-mode');
            htmlElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light-mode');
            
            // Actualizar los widgets que soportan tema claro
            updateWidgetsTheme('light');
        }
    });
}

// Actualizar el tema de los widgets externos
function updateWidgetsTheme(theme) {
    console.log('Actualizando widgets a tema:', theme);
    
    // Widget de mareas
    const tidesIframe = document.querySelector('.tides-widget iframe');
    if (tidesIframe && tidesIframe.src) {
        let newSrc = tidesIframe.src;
        
        if (theme === 'light' && tidesIframe.src.includes('theme=dark')) {
            newSrc = tidesIframe.src.replace('theme=dark', 'theme=light');
        } else if (theme === 'dark' && tidesIframe.src.includes('theme=light')) {
            newSrc = tidesIframe.src.replace('theme=light', 'theme=dark');
        }
        
        if (newSrc !== tidesIframe.src) {
            console.log('Actualizando iframe de mareas');
            tidesIframe.src = newSrc;
        }
    }
    
    // Widget de surf
    const surfIframe = document.querySelector('.surf-widget iframe');
    if (surfIframe && surfIframe.src) {
        let newSrc = surfIframe.src;
        
        if (theme === 'light' && surfIframe.src.includes('/dark')) {
            newSrc = surfIframe.src.replace('/dark', '/light');
        } else if (theme === 'dark' && surfIframe.src.includes('/light')) {
            newSrc = surfIframe.src.replace('/light', '/dark');
        }
        
        if (newSrc !== surfIframe.src) {
            console.log('Actualizando iframe de surf');
            surfIframe.src = newSrc;
        }
    }
}

// Configurar los botones de recarga
function setupReloadButtons() {
    const reloadTidesButton = document.getElementById('reload-tides-button');
    
    if (reloadTidesButton) {
        reloadTidesButton.addEventListener('click', function() {
            // Mostrar animación de carga
            this.classList.add('loading');
            
            // Recargar el iframe de mareas
            const tidesIframe = document.getElementById('tides-iframe');
            
            if (tidesIframe) {
                console.log('Recargando widget de mareas...');
                
                // Guardar la URL original
                const originalSrc = tidesIframe.src;
                
                // Limpiar el src para forzar la recarga
                tidesIframe.src = '';
                
                // Esperar un momento antes de recargar
                setTimeout(() => {
                    // Añadir un parámetro aleatorio para evitar caché
                    const cacheBuster = '&_cb=' + new Date().getTime();
                    tidesIframe.src = originalSrc + cacheBuster;
                    
                    // Quitar la animación de carga después de un tiempo
                    setTimeout(() => {
                        reloadTidesButton.classList.remove('loading');
                    }, 1000);
                }, 300);
            } else {
                // Si no se encuentra el iframe, quitar la animación
                reloadTidesButton.classList.remove('loading');
            }
        });
    }
} 