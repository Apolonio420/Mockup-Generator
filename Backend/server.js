const express = require('express');
const cors = require('cors'); // Importamos cors
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors()); // Habilitamos CORS

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de multer para recibir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Datos de posiciones de la estampa
const estampaPositions = {
  "Remera Oversized": {
    "Front": {
      "R1": { x: 2400, y: 1100, width: 500, height: 500 },
      "R2": { x: 1750, y: 1100, width: 900, height: 900 },
      "R3": { x: 1550, y: 1000, width: 1650, height: 1650 },
    },
    "Back": {
      "R1": { x: 1800, y: 2700, width: 500, height: 500 },
      "R2": { x: 1750, y: 1200, width: 900, height: 900 },
      "R3": { x: 1500, y: 1000, width: 1650, height: 1650 },
    },
  },
  "Buzo Oversized": {
    "Front": {
      "R1": { x: 2400, y: 1500, width: 500, height: 500 },
      "R2": { x: 1800, y: 1500, width: 800, height: 800 },
      "R3": { x: 1700, y: 1450, width: 1150, height: 1150 },
    },
    "Back": {
      "R1": { x: 1950, y: 1500, width: 500, height: 500 },
      "R2": { x: 1800, y: 1650, width: 900, height: 900 },
      "R3": { x: 1600, y: 1550, width: 1650, height: 1650 },
    },
  },
  "Remera Clásica": {
    "Front": {
      "R1": { x: 2400, y: 1100, width: 500, height: 500 },
      "R2": { x: 1800, y: 1100, width: 900, height: 900 },
      "R3": { x: 1600, y: 1000, width: 1650, height: 1650 },
    },
    "Back": {
      "R1": { x: 1850, y: 900, width: 500, height: 500 },
      "R2": { x: 1700, y: 1200, width: 900, height: 900 },
      "R3": { x: 1600, y: 1000, width: 1650, height: 1650 },
    },
  }
};

// URLs de las imágenes base
const baseImages = {
  "Remera Oversized": {
    "Blanco": {
      "Front": "Images/REM_Blanca_Oversize_FRONT.jpg",
      "Back": "Images/REM_Blanca_Oversize_BACK.jpg",
    },
    "Negro": {
      "Front": "Images/REM_Negra_Oversize_FRONT.jpg",
      "Back": "Images/REM_Negra_Oversize_BACK.jpg",
    },
    "Marrón": {
      "Front": "Images/REM_Marron_Oversize_FRONT.jpg",
      "Back": "Images/REM_Marron_Oversize_BACK.jpg",
    },
  },
  "Buzo Oversized": {
    "Negro": {
      "Front": "Images/BUZO_Negro_FRONT.jpg",
      "Back": "Images/BUZO_Negro_BACK.jpg",
    },
    "Marrón": {
      "Front": "Images/BUZO_Marron_FRONT.jpg",
      "Back": "Images/BUZO_Marron_BACK.jpg",
    }
  },
  "Remera Clásica": {
    "Blanco": {
      "Front": "Images/REM_Blanca_Clasica_FRONT.jpg",
      "Back": "Images/REM_Blanca_Clasica_BACK.jpg",
    },
    "Negro": {
      "Front": "Images/REM_Negra_Clasica_FRONT.jpg",
      "Back": "Images/REM_Negra_Clasica_BACK.jpg",
    }
  }
};

// Ruta principal para generar un mockup
app.post('/generar-mockup', upload.single('estampa'), async (req, res) => {
  const { producto, color, lado, tamano } = req.body;
  const estampaBuffer = req.file?.buffer;

  if (!producto || !color || !lado || !tamano || !estampaBuffer) {
    return res.status(400).send('Faltan parámetros o el archivo de la estampa.');
  }

  // Construir la ruta de la imagen base
  const baseImagePath = path.join(__dirname, 'public', baseImages[producto][color][lado]);

  // Verificar si la imagen base existe
  if (!fs.existsSync(baseImagePath)) {
    console.error('No se encontró la imagen base en la ruta:', baseImagePath);
    return res.status(404).send('No se encontró la imagen base.');
  }

  try {
    // Cargar la imagen base (buzo o remera)
    const baseImage = await loadImage(baseImagePath);

    // Crear canvas con las dimensiones de la imagen base
    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext('2d');

    // Dibujar la imagen base en el canvas
    ctx.drawImage(baseImage, 0, 0);

    // Cargar la imagen de la estampa
    const estampaImage = await loadImage(estampaBuffer);

    // Obtener las coordenadas y tamaño de la estampa
    const posicion = estampaPositions[producto][lado][tamano];

    // Obtener las dimensiones originales de la estampa
    const estampaWidth = estampaImage.width;
    const estampaHeight = estampaImage.height;

    // Calcular el factor de escala para mantener la proporción
    const scale = Math.min(posicion.width / estampaWidth, posicion.height / estampaHeight);

    // Calcular las nuevas dimensiones de la estampa
    const newWidth = estampaWidth * scale;
    const newHeight = estampaHeight * scale;

    // Usar las coordenadas x e y tal cual, sin centrar
    const x = posicion.x;
    const y = posicion.y;

    // Dibujar la estampa sobre la imagen base en la posición especificada
    ctx.drawImage(estampaImage, x, y, newWidth, newHeight);

    // Convertir el canvas a buffer de imagen (PNG)
    const outputBuffer = canvas.toBuffer('image/png');

    // Devolver la imagen generada como respuesta
    res.set('Content-Type', 'image/png');
    res.send(outputBuffer);

  } catch (error) {
    console.error('Error al generar el mockup:', error);
    res.status(500).send('Error interno del servidor al generar el mockup.');
  }
});

// Servir index.html en la ruta raíz (si es necesario)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exportar la aplicación para que Vercel pueda manejarla
module.exports = app;
