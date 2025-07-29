import { Tarea } from './tarea.js';

const inputTarea = document.getElementById("input");
const btnAgregar = document.getElementById("btnAgregar");
const listaTareas = document.getElementById("tareas");
const filtroEstado = document.getElementById("filtro-estado");
let tareas = [];

const cargarTareas = () => {
    const datos = localStorage.getItem("tareas");
    tareas = datos
        ? JSON.parse(datos).map(t => new Tarea(t.texto, t.id, t.estado, t.creado, t.modificado))
        : [];
};


const guardarTareas = () => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
};

const crearTarea = texto => {
    const nueva = new Tarea(texto);
    tareas.push(nueva);
    guardarTareas();
    renderizarTareas();
};

const actualizarTarea = (id, cambios) => {
    tareas = tareas.map(t =>
        t.id === id
            ? Object.assign(t, cambios, { modificado: new Date().toISOString() })
            : t
    );
    guardarTareas();
    renderizarTareas();
};

const eliminarTarea = id => {
    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    renderizarTareas();
};

const aplicarFiltros = array => {
    let resultado = [...array];
    const estado = filtroEstado.value;
    if (estado !== "todas") {
        const mapEstado = { creadas: "creada", pendientes: "en proceso", completadas: "terminada" };
        resultado = resultado.filter(t => t.estado === mapEstado[estado]);
    }
    return resultado;
};

const renderizarTareas = () => {
    listaTareas.innerHTML = '';
    const visibles = aplicarFiltros(tareas);
    visibles.forEach(t => {
        const tareaDiv = document.createElement("div");
        tareaDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 mb-3";

        tareaDiv.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <p class="card-text">${t.texto}</p>
              <small class="text-muted">Estado: ${t.estado} · Creada: ${new Date(t.creado).toLocaleString()} · Mod.: ${new Date(t.modificado).toLocaleString()}</small>
            </div>
            <div class="btn-group mt-3">
              <button class="btn btn-sm btn-outline-primary" data-id="${t.id}" data-accion="editar"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-sm btn-outline-success" data-id="${t.id}" data-accion="estado"><i class="bi bi-arrow-repeat"></i></button>
              <button class="btn btn-sm btn-outline-danger" data-id="${t.id}" data-accion="eliminar"><i class="bi bi-trash"></i></button>
            </div>
          </div>
        </div>
        `;
        listaTareas.appendChild(tareaDiv);
    });
};


document.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const id = btn.dataset.id;
    const accion = btn.dataset.accion;
    if (accion === "eliminar") eliminarTarea(id);
    if (accion === "editar") {
        const tarea = tareas.find(t => t.id === id);
        const nuevoTexto = prompt("Editar tarea:", tarea.texto);
        if (nuevoTexto) actualizarTarea(id, { texto: nuevoTexto });
    }
    if (accion === "estado") {
        const tarea = tareas.find(t => t.id === id);
        const estados = ["creada", "en proceso", "terminada"];
        const idx = (estados.indexOf(tarea.estado) + 1) % estados.length;
        actualizarTarea(id, { estado: estados[idx] });
    }
});

btnAgregar.addEventListener("click", () => {
    const texto = inputTarea.value.trim();
    if (!texto) return;
    crearTarea(texto);
    inputTarea.value = '';
});

filtroEstado.addEventListener("change", renderizarTareas);

cargarTareas();
renderizarTareas();
