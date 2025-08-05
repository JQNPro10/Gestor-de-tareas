import { Tarea } from './tarea.js';

const inputFiltroEstado = document.getElementById("filtro-estado");
const listaTareas = document.getElementById("tareas");
const btnAgregar = document.getElementById("btnAgregar");

const modalVer = new bootstrap.Modal(document.getElementById("modalVerTarea"));
const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarTarea"));

const verTitulo = document.getElementById("verTitulo");
const verContenido = document.getElementById("verContenido");
const verEstado = document.getElementById("verEstado");
const btnEditarDesdeVer = document.getElementById("btnEditarDesdeVer");

const editarTitulo = document.getElementById("editarTitulo");
const editarContenido = document.getElementById("editarContenido");
const editarEstado = document.getElementById("editarEstado");
const btnGuardarEdicion = document.getElementById("btnGuardarEdicion");

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
let idTareaEnEdicion = null;

function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

function aplicarFiltros(array) {
    const estadoFiltro = inputFiltroEstado?.value || "todas";
    if (estadoFiltro === "todas") return array;
    const mapEstados = { creadas: "Creada", pendientes: "En proceso", completadas: "Terminada" };
    return array.filter(t => t.estado === mapEstados[estadoFiltro]);
}

function renderizarTareas() {
    listaTareas.innerHTML = "";
    const visibles = aplicarFiltros(tareas);

    visibles.forEach(tarea => {
        const div = document.createElement("div");
        div.className = "col-md-4";

        div.innerHTML = `
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${tarea.titulo}</h5>
            <p class="card-subtitle text-muted mb-2">${tarea.estado}</p>
          </div>
          <div class="btn-group mt-3">
            <button class="btn btn-outline-primary btn-sm" data-accion="ver" data-id="${tarea.id}"><i class="bi bi-eye"></i></button>
            <button class="btn btn-outline-success btn-sm" data-accion="estado" data-id="${tarea.id}"><i class="bi bi-arrow-repeat"></i></button>
            <button class="btn btn-outline-danger btn-sm" data-accion="eliminar" data-id="${tarea.id}"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    `;

        listaTareas.appendChild(div);
    });
}

function cambiarEstado(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    const estados = ["Creada", "En proceso", "Terminada"];
    let idx = estados.indexOf(tarea.estado);
    idx = (idx + 1) % estados.length;
    tarea.estado = estados[idx];
    tarea.modificado = new Date().toISOString();
    guardarTareas();
    renderizarTareas();
}

function eliminarTarea(id) {
    tareas = tareas.filter(t => t.id !== id);
    guardarTareas();
    renderizarTareas();
}

function mostrarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;

    verTitulo.textContent = tarea.titulo;
    verContenido.textContent = tarea.contenido;
    verEstado.textContent = `Estado: ${tarea.estado} · Creada: ${new Date(tarea.creado).toLocaleString()} · Modificada: ${new Date(tarea.modificado).toLocaleString()}`;

    idTareaEnEdicion = tarea.id;
    modalVer.show();
}

btnAgregar.addEventListener("click", () => {
    idTareaEnEdicion = null;
    editarTitulo.value = "";
    editarContenido.value = "";
    editarEstado.value = "Creada";
});

btnGuardarEdicion.addEventListener("click", () => {
    const titulo = editarTitulo.value.trim();
    const contenido = editarContenido.value.trim();
    const estado = editarEstado.value;

    if (!titulo) {
        alert("El título no puede estar vacío");
        return;
    }

    if (idTareaEnEdicion) {
        const tarea = tareas.find(t => t.id === idTareaEnEdicion);
        if (!tarea) return;
        tarea.titulo = titulo;
        tarea.contenido = contenido;
        tarea.estado = estado;
        tarea.modificado = new Date().toISOString();
    } else {
        const nuevaTarea = new Tarea(titulo, contenido);
        nuevaTarea.estado = estado;
        tareas.push(nuevaTarea);
    }

    guardarTareas();
    renderizarTareas();
    modalEditar.hide();
    idTareaEnEdicion = null;
});

document.getElementById("modalEditarTarea").addEventListener("hidden.bs.modal", () => {
    if (!idTareaEnEdicion) {
        editarTitulo.value = "";
        editarContenido.value = "";
        editarEstado.value = "Creada";
    }
});

btnEditarDesdeVer.addEventListener("click", () => {
    const tarea = tareas.find(t => t.id === idTareaEnEdicion);
    if (!tarea) return;

    editarTitulo.value = tarea.titulo;
    editarContenido.value = tarea.contenido;
    editarEstado.value = tarea.estado;

    modalVer.hide();
    modalEditar.show();
});

listaTareas.addEventListener("click", e => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const accion = btn.dataset.accion;
    const id = btn.dataset.id;
    if (!accion || !id) return;

    if (accion === "ver") mostrarTarea(id);
    else if (accion === "eliminar") eliminarTarea(id);
    else if (accion === "estado") cambiarEstado(id);
});

if (inputFiltroEstado) {
    inputFiltroEstado.addEventListener("change", renderizarTareas);
}

renderizarTareas();
