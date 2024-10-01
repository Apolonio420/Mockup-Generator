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

// URLs de las imágenes base (ajusta las rutas según tu estructura de archivos)
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

// Función para actualizar los colores según el tipo de producto seleccionado
function actualizarColores(producto) {
  const colorSelect = document.getElementById('colorSelect');
  colorSelect.innerHTML = ''; // Limpiar opciones actuales
  
  let opcionesColores = [];
  if (producto === "Buzo Oversized") {
    opcionesColores = ["Negro", "Marrón"];
  } else if (producto === "Remera Clásica") {
    opcionesColores = ["Blanco", "Negro"];
  } else if (producto === "Remera Oversized") {
    opcionesColores = ["Blanco", "Negro", "Marrón"];
  }

  // Agregar las opciones dinámicamente
  opcionesColores.forEach(function (color) {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color;
    colorSelect.appendChild(option);
  });
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  // Obtener referencias a los elementos
  const estampaInput = document.getElementById('estampaInput');
  const productoSelect = document.getElementById('productoSelect');
  const colorSelect = document.getElementById('colorSelect');
  const ladoSelect = document.getElementById('ladoSelect');
  const tamanoSelect = document.getElementById('tamanoSelect');
  const generarMockupBtn = document.getElementById('generarMockup');
  const descargarMockupBtn = document.getElementById('descargarMockup');
  const canvasElement = document.getElementById('mockupCanvas');
  const ctx = canvasElement.getContext('2d');
  const spinner = document.getElementById('spinner');
  
  // Establecer tamaño optimizado para vista previa
  canvasElement.width = 1000;
  canvasElement.height = 1000;

  // Actualizar colores según el producto seleccionado
  productoSelect.addEventListener('change', function () {
    actualizarColores(productoSelect.value);
  });

  generarMockupBtn.addEventListener('click', function () {
    console.log('Botón "Generar Mockup" presionado');

    // Mostrar spinner mientras se genera el mockup
    spinner.style.display = 'block';

    // Obtener valores seleccionados
    const producto = productoSelect.value;
    const color = colorSelect.value;
    const lado = ladoSelect.value;
    const tamano = tamanoSelect.value;
    const estampaFile = estampaInput.files[0];

    console.log('Valores seleccionados:', { producto, color, lado, tamano, estampaFile });

    if (!estampaFile || !estampaFile.type.startsWith('image/')) {
      alert('Por favor, carga una imagen válida.');
      spinner.style.display = 'none';
      return;
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Cargar la imagen base
    const baseImageUrl = baseImages[producto][color][lado];
    console.log('URL de la imagen base:', baseImageUrl);

    if (!baseImageUrl) {
      alert('No se encontró la imagen base para la combinación seleccionada.');
      spinner.style.display = 'none';
      return;
    }

    // Cargar la imagen base
    const baseImage = new Image();
    baseImage.src = baseImageUrl;
    baseImage.onload = function () {
      console.log('Imagen base cargada');

      // Dibujar la imagen base en el canvas
      ctx.drawImage(baseImage, 0, 0, canvasElement.width, canvasElement.height);

      // Leer el archivo de la estampa
      const reader = new FileReader();
      reader.onload = function (e) {
        // Crear una imagen para la estampa
        const estampaImage = new Image();
        estampaImage.src = e.target.result;

        estampaImage.onload = function () {
          console.log('Imagen de la estampa cargada');

          // Obtener las coordenadas y dimensiones
          const posicion = estampaPositions[producto][lado][tamano];
          console.log('Posición y tamaño de la estampa:', posicion);

          // Dibujar la estampa en el canvas con las dimensiones correctas
          ctx.drawImage(
            estampaImage,
            posicion.x * (canvasElement.width / 4000), // Ajuste para mantener proporción en canvas de vista previa
            posicion.y * (canvasElement.height / 4000),
            posicion.width * (canvasElement.width / 4000),
            posicion.height * (canvasElement.height / 4000)
          );

          console.log('Estampa añadida al canvas');
          spinner.style.display = 'none';  // Ocultar el spinner cuando todo esté listo
        };

        // Manejar error en la carga de la imagen de la estampa
        estampaImage.onerror = function () {
          alert('Error al cargar la imagen de estampa. Por favor, selecciona un archivo válido.');
          spinner.style.display = 'none';
        };
      };
      reader.readAsDataURL(estampaFile);
    };

    // Manejar errores en la carga de la imagen base
    baseImage.onerror = function () {
      alert('Error al cargar la imagen base. Verifica que la ruta sea correcta.');
      console.error('Error al cargar la imagen base:', baseImageUrl);
      spinner.style.display = 'none';
    };
  });

  // Evento para descargar el mockup
  descargarMockupBtn.addEventListener('click', function () {
    console.log('Botón "Descargar Mockup" presionado');
    const format = prompt('Elige el formato de descarga: png o jpg', 'png');
    
    const dataURL = canvasElement.toDataURL(`image/${format}`);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `mockup.${format}`;
    link.click();

    console.log('Mockup descargado');
  });
});
