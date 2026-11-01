"use_strict";

const $ = (selector) => document.querySelector(selector);

const tareas = [
  {
    id: 1,
    titulo: "Comprar mortadela",
    prioridad: "alta",
    estado: "pendiente",
  },
  {
    id: 2,
    titulo: "Comprar aceitunas",
    prioridad: "media",
    estado: "en-proceso",
  },
  {
    id: 3,
    titulo: "Comer mortadela con aceitunas",
    prioridad: "baja",
    estado: "completada",
  },
];

let siguienteId = 4;
let busqueda = "";
const estados = ["pendiente", "en-proceso", "completada"];

function avisar(texto) {
  $("#mensaje").textContent = texto;
}

// Evento que en un intervalo muy corto, pueda suceder varias veces (fn = evento; ms = tiempo de espera).
function debounce(fn, ms) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), ms);
  };
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();

    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

function notificarCambio() {
  const total = tareas.length;

  const tareasNoCompletadas = tareas.filter((t) => t.estado !== "completada");

  $("#tablero").dispatchEvent(
    new CustomEvent("tareas:cambiadas", {
      bubbles: true,
      detail: {
        total: total,
        noCompleadas: tareasNoCompletadas.length,
      },
    }),
  );
}

document.addEventListener("tareas:cambiadas", (event) => {
  console.log("Evento recibido: ", event.type);
  console.log("Detalles: ", event.detail);
});

function renderizar(){
  for (const estado of estados) {
    $('#' + estado).replaceChildren();
  }

  const filtro = $('#filtro').value;

  for (const tarea of tareas){

    if ( filtro !== 'todas' && tarea.prioridad !== filtro) {

      continue;
    }

    if (!tarea.titulo.toLocaleLowerCase().includes(busqueda)) {
      continue;
    }

    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarea';
    tarjeta.dataset.id = tarea.id;
    tarjeta.dataset.prioridad = tarea.prioridad;


    const titulo = document.createElement('h4');
    titulo.textContent = tarea.titulo;
    tarjeta.append(titulo);


    const detalle = document.createElement('small');
    detalle.textContent = 'Prioridad' + tarea.prioridad;
    tarjeta.append(detalle, document.createElement('br'));

    for (const [accion, texto] of [
      ['anterior', '<- Anterior ->'], 
      ['siguiente', 'Siguiente ->'], 
      ['eliminar', 'Eliminar']]) 
      {

        const boton = document.createElement('button');

        boton.type = 'button';

        boton.dataset.accion = accion;

        boton.textContent = texto;

        const indice = estados.indexOf(tarea.estado);

        boton.disabled = 
          (accion === 'anterior' && indice === 0 || (accion === 'siguiente' && indice === 2));

        tarjeta.append(boton);  
    }

    $('#' + tarea.estado).append(tarjeta);

    //TODO QUEDASTE POR AQUÍ (24:52)
  }
}
