// Paso 1: Definir los datos
const baseDeDatosCloud = [
  { nombre: "Amazon EC2", tipo: "IaaS", estado: "Activo", costo: 35.00 },
  { nombre: "Google Drive Enterprise", tipo: "SaaS", estado: "Activo", costo: 12.50 },
  { nombre: "Heroku App Server", tipo: "PaaS", estado: "Inactivo", costo: 0.00 },
  { nombre: "Azure Virtual Machines", tipo: "IaaS", estado: "Activo", costo: 40.00 }
];

// Paso 2: Crear la función flecha
const cargarServicios = () => {
  // Limpiar el contenido actual del contenedor
  const contenedor = document.getElementById("contenedor-servicios");
  contenedor.innerHTML = "";

  // Recorrer el arreglo usando forEach
  baseDeDatosCloud.forEach((servicio) => {
    // Reto Lógico: Decidir la clase CSS según el estado
    let claseEstado;
    if (servicio.estado === "Activo") {
      claseEstado = "activo";
    } else {
      claseEstado = "inactivo";
    }

    // Usar Template Strings para crear el HTML de cada tarjeta
    const tarjetaHTML = `
      <div class="card">
        <h3>${servicio.nombre}</h3>
        <p class="tipo">Tipo: ${servicio.tipo}</p>
        <p>Estado: <span class="${claseEstado}">${servicio.estado}</span></p>
        <p>Costo mensual: ${servicio.costo.toFixed(2)}</p>
      </div>
    `;

    // Inyectar la tarjeta en el contenedor
    contenedor.innerHTML += tarjetaHTML;
  });
};