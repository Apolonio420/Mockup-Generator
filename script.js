document.addEventListener('DOMContentLoaded', function () {
  // Obtener referencias a los elementos
  const estampaInput = document.getElementById('estampaInput');
  const productoSelect = document.getElementById('productoSelect');
  const colorSelect = document.getElementById('colorSelect');
  const ladoSelect = document.getElementById('ladoSelect');
  const tamanoSelect = document.getElementById('tamanoSelect');
  const generarMockupBtn = document.getElementById('generarMockup');
  const descargarMockupBtn = document.getElementById('descargarMockup');
  const imagenResultado = document.getElementById('imagenResultado');
  const spinner = document.getElementById('spinner');

  // Función para actualizar los colores según el producto seleccionado
  function actualizarColores(producto) {
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

  // Actualizar colores según el producto seleccionado al cargar la página
  actualizarColores(productoSelect.value);

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

    // Crear un FormData para enviar los datos y el archivo
    const formData = new FormData();
    formData.append('producto', producto);
    formData.append('color', color);
    formData.append('lado', lado);
    formData.append('tamano', tamano);
    formData.append('estampa', estampaFile);

    // Enviar la solicitud al backend en Vercel
    fetch('https://mockup-generator-pink.vercel.app/generar-mockup', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.blob();
      })
      .then(blob => {
        console.log('Respuesta recibida del backend');
        // Crear una URL para la imagen recibida
        const imageUrl = URL.createObjectURL(blob);
        // Mostrar la imagen en el frontend
        imagenResultado.src = imageUrl;
        // Habilitar el botón de descarga
        descargarMockupBtn.style.display = 'inline-block';
        // Ocultar el spinner
        spinner.style.display = 'none';
      })
      .catch(error => {
        console.error('Error al generar el mockup:', error);
        alert('Hubo un error al generar el mockup. Por favor, inténtalo de nuevo.');
        spinner.style.display = 'none';
      });
  });

  // Evento para descargar el mockup
  descargarMockupBtn.addEventListener('click', function () {
    console.log('Botón "Descargar Mockup" presionado');
    const format = prompt('Elige el formato de descarga: png o jpg', 'png');
    if (!format) return;

    // Crear un enlace temporal para descargar la imagen
    const link = document.createElement('a');
    link.href = imagenResultado.src;
    link.download = `mockup.${format}`;
    link.click();

    console.log('Mockup descargado');
  });

  // Ocultar el botón de descarga inicialmente
  descargarMockupBtn.style.display = 'none';
});
