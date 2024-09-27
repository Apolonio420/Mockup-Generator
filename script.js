// Datos de posiciones de la estampa
const estampaPositions = {
    "Remera Oversized": {
      "Front": {
        "R1": { x: 2600, y: 1250, width: 500, height: 500 },
        "R2": { x: 2000, y: 1650, width: 900, height: 900 },
        "R3": { x: 2000, y: 1950, width: 1650, height: 1650 },
      },
      "Back": {
        "R1": { x: 2000, y: 1100, width: 500, height: 500 },
        "R2": { x: 2000, y: 1750, width: 900, height: 900 },
        "R3": { x: 2000, y: 2000, width: 1650, height: 1650 },
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
  
  // Obtener referencias a los elementos
  const estampaInput = document.getElementById('estampaInput');
  const colorSelect = document.getElementById('colorSelect');
  const ladoSelect = document.getElementById('ladoSelect');
  const tamanoSelect = document.getElementById('tamanoSelect');
  const generarMockupBtn = document.getElementById('generarMockup');
  const descargarMockupBtn = document.getElementById('descargarMockup');
  const canvasElement = document.getElementById('mockupCanvas');
  
  // Verificar que los elementos existen
  console.log({
    estampaInput,
    colorSelect,
    ladoSelect,
    tamanoSelect,
    generarMockupBtn,
    descargarMockupBtn,
    canvasElement
  });
  
  // Crear el canvas de Fabric.js
  const canvas = new fabric.Canvas("mockupCanvas");
  canvas.setWidth(4000);
  canvas.setHeight(4000);
  
  generarMockupBtn.addEventListener("click", function () {
    console.log('Botón "Generar Mockup" presionado');
  
    // Obtener valores seleccionados
    const color = colorSelect.value;
    const lado = ladoSelect.value;
    const tamano = tamanoSelect.value;
    const estampaFile = estampaInput.files[0];
  
    console.log('Valores seleccionados:', { color, lado, tamano, estampaFile });
  
    if (!estampaFile) {
      alert("Por favor, carga una imagen de estampa.");
      return;
    }
  
    // Limpiar el canvas
    canvas.clear();
  
    // Cargar la imagen base
    const baseImageUrl = baseImages["Remera Oversized"][color][lado];
  
    console.log('URL de la imagen base:', baseImageUrl);
  
    if (!baseImageUrl) {
      alert("No se encontró la imagen base para la combinación seleccionada.");
      return;
    }
  
    fabric.Image.fromURL(
      baseImageUrl,
      function (baseImg) {
        console.log('Imagen base cargada:', baseImg);
  
        baseImg.set({ selectable: false });
        canvas.setBackgroundImage(baseImg, canvas.renderAll.bind(canvas));
  
        // Cargar la imagen de la estampa
        const reader = new FileReader();
        reader.onload = function (e) {
          fabric.Image.fromURL(
            e.target.result,
            function (estampaImg) {
              console.log('Imagen de la estampa cargada:', estampaImg);
  
              // Obtener las coordenadas y dimensiones
              const posicion = estampaPositions["Remera Oversized"][lado][tamano];
  
              console.log('Posición y tamaño de la estampa:', posicion);
  
              // Ajustar el tamaño de la estampa
              estampaImg.scaleToWidth(posicion.width);
              estampaImg.scaleToHeight(posicion.height);
  
              // Posicionar la estampa
              estampaImg.set({
                left: posicion.x,
                top: posicion.y,
                selectable: false,
              });
  
              // Añadir la estampa al canvas
              canvas.add(estampaImg);
              canvas.renderAll();
  
              console.log('Estampa añadida al canvas');
            },
            { crossOrigin: "anonymous" }
          );
        };
        reader.readAsDataURL(estampaFile);
      },
      { crossOrigin: "anonymous" }
    );
  });
  
  // Evento para descargar el mockup
  descargarMockupBtn.addEventListener("click", function () {
    console.log('Botón "Descargar Mockup" presionado');
  
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "mockup.png";
    link.click();
  
    console.log('Mockup descargado');
  });
  