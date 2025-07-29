export class Tarea {
    constructor(texto = '', id = null, estado = "creada", creado = null, modificado = null) {
        const ahora = new Date().toISOString();
        this.id = id || Date.now().toString();
        this.texto = texto;
        this.estado = estado;
        this.creado = creado || ahora;
        this.modificado = modificado || ahora;
    }
}