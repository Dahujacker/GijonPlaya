#!/bin/bash

# Este script convierte el icono proporcionado en varios tamaños
# Nota: Requiere ImageMagick instalado (convert command)

# Crear directorio icons si no existe
mkdir -p icons

# Comprobar si tenemos el icono original
if [ ! -f "gijon-icon-original.png" ]; then
    echo "Por favor, guarda el icono como 'gijon-icon-original.png' en la raíz del proyecto."
    exit 1
fi

# Convertir a diferentes tamaños
echo "Creando íconos en diferentes tamaños..."

# Icono de 192x192 píxeles para la mayoría de dispositivos
convert gijon-icon-original.png -resize 192x192 icons/gijon-icon-192.png

# Icono de 512x512 píxeles para dispositivos de alta resolución
convert gijon-icon-original.png -resize 512x512 icons/gijon-icon-512.png

# Icono maskable (con área segura para recorte)
convert gijon-icon-original.png -resize 192x192 -gravity center -background transparent -extent 240x240 icons/gijon-icon-maskable.png

# Favicon para el navegador
convert gijon-icon-original.png -resize 32x32 favicon.ico

echo "¡Iconos creados exitosamente!"
echo "Los iconos se han guardado en la carpeta 'icons/'."
echo "También se ha creado el archivo favicon.ico en la raíz del proyecto." 