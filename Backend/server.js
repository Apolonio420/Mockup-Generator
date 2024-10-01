const express = require('express');
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');

const app = express();
// Cambiar el puerto para utilizar el que proporciona Vercel
const port = process.env.PORT || 3000;

// Configuración de multer para recibir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Datos de posiciones de la estampa
const estampaPositions = {
  "Remera Oversized": {
    "Front": {
      "R1": { x: 2400, y: 1100, width: 500, height: 500 },
      "R2": { x: 1500, y: 1100, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
    "Back": {
      "R1": { x: 1500, y: 1000, width: 500, height: 500 },
      "R2": { x: 1500, y: 1200, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
  },
  "Buzo Oversized": {
    "Front": {
      "R1": { x: 2400, y: 1100, width: 500, height: 500 },
      "R2": { x: 1500, y: 1100, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
    "Back": {
      "R1": { x: 1500, y: 1000, width: 500, height: 500 },
      "R2": { x: 1500, y: 1200, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
  },
  "Remera Clásica": {
    "Front": {
      "R1": { x: 2400, y: 1100, width: 500, height: 500 },
      "R2": { x: 1500, y: 1100, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
    "Back": {
      "R1": { x: 1500, y: 1000, width: 500, height: 500 },
      "R2": { x: 1500, y: 1200, width: 900, height: 900 },
      "R3": { x: 1200, y: 1000, width: 1650, height: 1650 },
    },
  }
};

// Actualización de la ruta para imágenes en la carpeta 'public'
const baseImages = {
  "Remera Oversized": {
    "Blanco": {
      "Front": "/public/Images/REM_Blanca_Oversize_FRONT.jpg",
      "Back": "/public/Images/REM_Blanca_Oversize_BACK.jpg",
    },
    "Negro": {
      "Front": "/public/Images/REM_Negra_Oversize_FRONT.jpg",
      "Back": "/public/Images/REM_Negra_Oversize_BACK.jpg",
    },
    "Marrón": {
      "Front": "/public/Images/REM_Marron_Oversize_FRONT.jpg",
      "Back": "/public/Images/REM_Marron_Oversize_BACK.jpg",
    },
  },
  "Buzo Oversized": {
    "Negro": {
      "Front": "/public/Images/BUZO_Negro_FRONT.jpg",
      "Back": "/public/Images/BUZO_Negro_BACK.jpg",
    },
    "Marrón": {
      "Front": "/public/Images/BUZO_Marron_FRONT.jpg",
      "Back": "/public/Images/BUZO_Marron_BACK.jpg",
    }
  },
  "Remera Clásica": {
    "Blanco": {
      "Front": "/public/Images/REM_Blanca_Clasica_FRONT.jpg",
      "Back": "/public/Images/REM_Blanca_Clasica_BACK.jpg",
    },
    "Negro": {
      "Front": "/public/Images/REM_Negra_Clasica_FRONT.jpg",
      "Back": "/public/Images/REM_Negra_Clasica_BACK.jpg",
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

  const baseImageUrl = baseImages[producto][color][lado];
  if (!baseImageUrl) {
    return res.status(404).send('No se encontró la imagen base.');
  }

  // Crear canvas
  const canvas = createCanvas(4000, 4000);
  const ctx = canvas.getContext('2d');

  try {
    // Cargar la imagen base (buzo o remera)
    console.log("Cargando imagen base:", baseImageUrl);
    const baseImage = await loadImage(path.join(__dirname, baseImageUrl));
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

    // Cargar la imagen de la estampa
    console.log("Cargando imagen de la estampa...");
    const estampaImage = await loadImage(estampaBuffer);

    // Obtener las coordenadas y tamaño de la estampa
    const posicion = estampaPositions[producto][lado][tamano];

    // Dibujar la estampa sobre la imagen base
    ctx.drawImage(estampaImage, posicion.x, posicion.y, posicion.width, posicion.height);

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

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor de mockups escuchando en http://localhost:${port}`);
});