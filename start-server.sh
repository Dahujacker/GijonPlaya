#!/bin/bash

# Activar entorno virtual si existe
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

echo "Iniciando servidor para Gijón Live PWA..."

# Mostrar IP local para conexión desde dispositivos móviles
echo "Direcciones IP disponibles para conexión desde dispositivos móviles:"
hostname -I

echo "Accede a http://TU_IP_LOCAL:8000 en tu navegador móvil"
echo "Usando Python 3 para iniciar servidor..."

# Iniciar el servidor con Python 3 en todas las interfaces
python3 -m http.server 8000

# Si Python 3 no está disponible, intentar con Python 2
if [ $? -ne 0 ]; then
    echo "Python 3 no disponible, intentando con Python 2..."
    python -m SimpleHTTPServer 8000
fi 