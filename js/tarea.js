export class Tarea {
    constructor(titulo, contenido) {
        this.id = crypto.randomUUID();
        this.titulo = titulo;
        this.contenido = contenido;
        this.estado = "Creada";
        this.creado = new Date().toISOString();
        this.modificado = new Date().toISOString();
    }
}
