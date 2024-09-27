// Datos de posiciones de la estampa
const estampaPositions = {
    "Remera Oversized": {
      Front: {
        R1: { x: 2600, y: 1250, width: 500, height: 500 },
        R2: { x: 2000, y: 1650, width: 900, height: 900 },
        R3: { x: 2000, y: 1950, width: 1650, height: 1650 },
      },
      Back: {
        R1: { x: 2000, y: 1100, width: 500, height: 500 },
        R2: { x: 2000, y: 1750, width: 900, height: 900 },
        R3: { x: 2000, y: 2000, width: 1650, height: 1650 },
      },
    },
  };
  
  // URLs de las imágenes base (ajusta las rutas según tu estructura de archivos)
  const baseImages = {
    "Remera Oversized": {
      Blanco: {
        Front: "Images/REM_Blanca_Oversize_FRONT.jpg", // Verifica que este archivo exista
        Back: "Images/REM_Blanca_Oversize_BACK.jpg", // Asegúrate de que estas rutas son correctas
      },
      Negro: {
        Front: "imagenes/Negro_Front.jpg",
        Back: "imagenes/Negro_Back.jpg",
      },
      Marrón: {
        Front: "imagenes/Marron_Front.jpg",
        Back: "imagenes/Marron_Back.jpg",
      },
    },
};
  
  document.addEventListener("DOMContentLoaded", function () {
    // Obtener referencias a los elementos
    const estampaInput = document.getElementById("estampaInput");
    const colorSelect = document.getElementById("colorSelect");
    const ladoSelect = document.getElementById("ladoSelect");
    const tamañoSelect = document.getElementById("tamañoSelect");
    const generarMockupBtn = document.getElementById("generarMockup");
    const descargarMockupBtn = document.getElementById("descargarMockup");
    const canvasElement = document.getElementById("mockupCanvas");
  
    // Crear el canvas de Fabric.js
    const canvas = new fabric.Canvas("mockupCanvas");
    canvas.setWidth(4000);
    canvas.setHeight(4000);
  
    generarMockupBtn.addEventListener("click", function () {
      // Obtener valores seleccionados
      const color = colorSelect.value;
      const lado = ladoSelect.value;
      const tamaño = tamañoSelect.value;
      const estampaFile = estampaInput.files[0];
  
      if (!estampaFile) {
        alert("Por favor, carga una imagen de estampa.");
        return;
      }
  
      // Limpiar el canvas
      canvas.clear();
  
      // Cargar la imagen base
      const baseImageUrl = baseImages["Remera Oversized"][color][lado];
  
      if (!baseImageUrl) {
        alert("No se encontró la imagen base para la combinación seleccionada.");
        return;
      }
  
      fabric.Image.fromURL(
        baseImageUrl,
        function (baseImg) {
          baseImg.set({ selectable: false });
          canvas.setBackgroundImage(baseImg, canvas.renderAll.bind(canvas));
  
          // Cargar la imagen de la estampa
          const reader = new FileReader();
          reader.onload = function (e) {
            fabric.Image.fromURL(
              e.target.result,
              function (estampaImg) {
                // Obtener las coordenadas y dimensiones
                const posicion =
                  estampaPositions["Remera Oversized"][lado][tamaño];
  
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
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "mockup.png";
      link.click();
    });
  });
  