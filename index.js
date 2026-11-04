"use strict";

// ============================================
//                 ATEMPORAL
//       Organiza tus días. Construye tu futuro.
// ============================================

const ATEMPORAL = {
    nombre: "ATEMPORAL",

    tareas: [],
    objetivos: [],
    habitos: [],
    eventos: [],
    notas: [],
    movimientos: [],

    fechaActual() {
        return new Date().toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    },

    encabezado() {
        console.log("\n");
        console.log("==========================================");
        console.log("              ATEMPORAL");
        console.log("   Organiza tus días. Construye tu futuro.");
        console.log("==========================================");
        console.log("Fecha:", this.fechaActual());
        console.log("------------------------------------------");
    },

    agregarTarea(nombre, fecha = "Sin fecha") {
        if (!nombre || !nombre.trim()) return;

        this.tareas.push({
            nombre: nombre.trim(),
            fecha,
            completada: false
        });

        console.log("Tarea agregada:", nombre);
    },

    completarTarea(numero) {
        const tarea = this.tareas[numero - 1];

        if (!tarea) {
            console.log("No se encontró esa tarea.");
            return;
        }

        tarea.completada = true;
        console.log("Tarea completada:", tarea.nombre);
    },

    mostrarTareas() {
        console.log("\n--- MIS TAREAS ---");

        if (this.tareas.length === 0) {
            console.log("No tienes tareas registradas.");
            return;
        }

        this.tareas.forEach((tarea, indice) => {
            const estado = tarea.completada ? "Hecha" : "Pendiente";

            console.log(
                `${indice + 1}. ${tarea.nombre} | ${tarea.fecha} | ${estado}`
            );
        });
    },

    agregarObjetivo(nombre) {
        if (!nombre || !nombre.trim()) return;

        this.objetivos.push({
            nombre: nombre.trim(),
            completado: false
        });

        console.log("Objetivo agregado:", nombre);
    },

    completarObjetivo(numero) {
        const objetivo = this.objetivos[numero - 1];

        if (!objetivo) {
            console.log("Objetivo no encontrado.");
            return;
        }

        objetivo.completado = true;
        console.log("Objetivo completado:", objetivo.nombre);
    },

    mostrarObjetivos() {
        console.log("\n--- MIS OBJETIVOS ---");

        if (this.objetivos.length === 0) {
            console.log("No tienes objetivos registrados.");
            return;
        }

        this.objetivos.forEach((objetivo, indice) => {
            console.log(
                `${indice + 1}. ${objetivo.nombre} | ${
                    objetivo.completado ? "Completado" : "En progreso"
                }`
            );
        });
    },

    agregarHabito(nombre) {
        if (!nombre || !nombre.trim()) return;

        this.habitos.push({
            nombre: nombre.trim(),
            registros: []
        });

        console.log("Hábito agregado:", nombre);
    },

    registrarHabito(numero) {
        const habito = this.habitos[numero - 1];

        if (!habito) {
            console.log("Hábito no encontrado.");
            return;
        }

        const hoy = new Date().toLocaleDateString("en-CA");

        if (habito.registros.includes(hoy)) {
            console.log("Este hábito ya fue registrado hoy.");
            return;
        }

        habito.registros.push(hoy);
        console.log("Hábito registrado:", habito.nombre);
    },

    mostrarHabitos() {
        console.log("\n--- MIS HÁBITOS ---");

        if (this.habitos.length === 0) {
            console.log("No tienes hábitos registrados.");
            return;
        }

        this.habitos.forEach((habito, indice) => {
            console.log(
                `${indice + 1}. ${habito.nombre} | ${habito.registros.length} días`
            );
        });
    },

    agregarEvento(nombre, fecha) {
        if (!nombre || !nombre.trim() || !fecha) {
            console.log("Completa el nombre y la fecha.");
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            console.log("Usa el formato AAAA-MM-DD.");
            return;
        }

        const [anio, mes, dia] = fecha.split("-").map(Number);
        const comprobacion = new Date(anio, mes - 1, dia);

        if (
            comprobacion.getFullYear() !== anio ||
            comprobacion.getMonth() !== mes - 1 ||
            comprobacion.getDate() !== dia
        ) {
            console.log("La fecha no es válida.");
            return;
        }

        this.eventos.push({
            nombre: nombre.trim(),
            fecha
        });

        console.log("Evento agregado:", nombre);
    },

    mostrarCalendario() {
        console.log("\n--- MI CALENDARIO ---");

        if (this.eventos.length === 0) {
            console.log("No tienes eventos registrados.");
            return;
        }

        const ordenados = [...this.eventos].sort(
            (a, b) => a.fecha.localeCompare(b.fecha)
        );

        ordenados.forEach(evento => {
            console.log(`${evento.fecha} | ${evento.nombre}`);
        });
    },

    agregarNota(titulo, contenido) {
        if (!titulo || !titulo.trim() || !contenido || !contenido.trim()) {
            console.log("Completa el título y el contenido.");
            return;
        }

        this.notas.push({
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            fecha: this.fechaActual()
        });

        console.log("Nota guardada:", titulo);
    },

    mostrarNotas() {
        console.log("\n--- MIS NOTAS ---");

        if (this.notas.length === 0) {
            console.log("No tienes notas guardadas.");
            return;
        }

        this.notas.forEach((nota, indice) => {
            console.log(`${indice + 1}. ${nota.titulo}`);
            console.log(nota.contenido);
            console.log("Fecha:", nota.fecha);
        });
    },

    agregarMovimiento(tipo, cantidad, descripcion) {
        if (
            !["ingreso", "gasto"].includes(tipo) ||
            !Number.isFinite(cantidad) ||
            cantidad <= 0
        ) {
            console.log("Movimiento no válido.");
            return;
        }

        this.movimientos.push({
            tipo,
            cantidad,
            descripcion: descripcion || "Sin descripción"
        });

        console.log("Movimiento registrado.");
    },

    mostrarFinanzas() {
        const ingresos = this.movimientos
            .filter(m => m.tipo === "ingreso")
            .reduce((total, m) => total + m.cantidad, 0);

        const gastos = this.movimientos
            .filter(m => m.tipo === "gasto")
            .reduce((total, m) => total + m.cantidad, 0);

        console.log("\n--- MIS FINANZAS ---");
        console.log("Ingresos: S/ " + ingresos.toFixed(2));
        console.log("Gastos: S/ " + gastos.toFixed(2));
        console.log("Balance: S/ " + (ingresos - gastos).toFixed(2));
    },

    mostrarResumen() {
        this.encabezado();

        console.log("RESUMEN GENERAL");
        console.log("------------------------------------------");
        console.log("Tareas pendientes:",
            this.tareas.filter(t => !t.completada).length);
        console.log("Objetivos:", this.objetivos.length);
        console.log("Hábitos:", this.habitos.length);
        console.log("Eventos:", this.eventos.length);
        console.log("Notas:", this.notas.length);
        console.log("------------------------------------------");
        console.log("Tu progreso comienza con pequeños pasos.");
    }
};

// ============================================
//          INICIO DE ATEMPORAL
// ============================================

ATEMPORAL.encabezado();
ATEMPORAL.mostrarResumen();

console.log("\nATEMPORAL se ha iniciado correctamente.");
console.log("El sistema está preparado para registrar tus actividades.");
