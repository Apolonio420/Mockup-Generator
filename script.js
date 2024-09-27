// Datos de posiciones de la estampa
const estampaPositions = {
    "Remera Oversized": {
      "Front": {
        "R1": { x: 2400, y: 1750, width: 500, height: 500 },
        "R2": { x: 1000, y: 1650, width: 900, height: 900 },
        "R3": { x: 1000, y: 1650, width: 1650, height: 1650 },
      },
      "Back": {
        "R1": { x: 1000, y: 1100, width: 500, height: 500 },
        "R2": { x: 1000, y: 1750, width: 900, height: 900 },
        "R3": { x: 1000, y: 2000, width: 1650, height: 1650 },
      },
    },
  };
  
  // URLs de las imágenes base (ajusta las rutas según tu estructura de archivos)
  const baseImages = {
    "Remera Oversized": {
      "Blanco": {
        "Front": "Images/REM_Blanca_Oversize_FRONT.jpg",
        "Back": "Images/REM_Blanca_Oversize_BACK.jpg",
      },
      "Negro": {
        "Front": "Images/REM_Negro_Oversize_FRONT.jpg",
        "Back": "Images/REM_Negro_Oversize_BACK.jpg",
      },
      "Marrón": {
        "Front": "Images/REM_Marrón_Oversize_FRONT.jpg",
        "Back": "Images/REM_Marrón_Oversize_BACK.jpg",
      },
    },
  };
  
  // Esperar a que el DOM esté cargado
  document.addEventListener('DOMContentLoaded', function () {
    // Obtener referencias a los elementos
    const estampaInput = document.getElementById('estampaInput');
    const colorSelect = document.getElementById('colorSelect');
    const ladoSelect = document.getElementById('ladoSelect');
    const tamanoSelect = document.getElementById('tamanoSelect');
    const generarMockupBtn = document.getElementById('generarMockup');
    const descargarMockupBtn = document.getElementById('descargarMockup');
    const canvasElement = document.getElementById('mockupCanvas');
    const ctx = canvasElement.getContext('2d');
  
    generarMockupBtn.addEventListener('click', function () {
      console.log('Botón "Generar Mockup" presionado');
  
      // Obtener valores seleccionados
      const color = colorSelect.value;
      const lado = ladoSelect.value;
      const tamano = tamanoSelect.value;
      const estampaFile = estampaInput.files[0];
  
      console.log('Valores seleccionados:', { color, lado, tamano, estampaFile });
  
      if (!estampaFile) {
        alert('Por favor, carga una imagen de estampa.');
        return;
      }
  
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
      // Cargar la imagen base
      const baseImageUrl = baseImages["Remera Oversized"][color][lado];
  
      console.log('URL de la imagen base:', baseImageUrl);
  
      if (!baseImageUrl) {
        alert('No se encontró la imagen base para la combinación seleccionada.');
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
            const posicion = estampaPositions["Remera Oversized"][lado][tamano];
  
            console.log('Posición y tamaño de la estampa:', posicion);
  
            // Dibujar la estampa en el canvas
            ctx.drawImage(
              estampaImage,
              posicion.x,
              posicion.y,
              posicion.width,
              posicion.height
            );
  
            console.log('Estampa añadida al canvas');
          };
        };
        reader.readAsDataURL(estampaFile);
      };
  
      // Manejar errores en la carga de la imagen base
      baseImage.onerror = function () {
        alert('Error al cargar la imagen base. Verifica que la ruta sea correcta.');
        console.error('Error al cargar la imagen base:', baseImageUrl);
      };
    });
  
    // Evento para descargar el mockup
    descargarMockupBtn.addEventListener('click', function () {
      console.log('Botón "Descargar Mockup" presionado');
  
      const dataURL = canvasElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'mockup.png';
      link.click();
  
      console.log('Mockup descargado');
    });
  });
  