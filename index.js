"use strict";

const ATEMPORAL = {
    // Corregido: Ahora se inicializan correctamente los arreglos vacíos si no hay datos previos
    tareas: JSON.parse(localStorage.getItem("at_tareas")) || [],
    objetivos: JSON.parse(localStorage.getItem("at_objetivos")) || [],
    habitos: JSON.parse(localStorage.getItem("at_habitos")) || [],
    movimientos: JSON.parse(localStorage.getItem("at_movimientos")) || [],

    guardar() {
        localStorage.setItem("at_tareas", JSON.stringify(this.tareas));
        localStorage.setItem("at_objetivos", JSON.stringify(this.objetivos));
        localStorage.setItem("at_habitos", JSON.stringify(this.habitos));
        localStorage.setItem("at_movimientos", JSON.stringify(this.movimientos));
    },

    fechaActual() {
        return new Date().toLocaleDateString("es-PE", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    },

    agregarTarea(nombre) {
        if (!nombre || !nombre.trim()) return;
        this.tareas.push({ nombre: nombre.trim(), completada: false });
        this.guardar();
    },

    completarTarea(indice) {
        if (this.tareas[indice]) {
            this.tareas[indice].completada = true;
            this.guardar();
        }
    },

    eliminarTarea(indice) {
        this.tareas.splice(indice, 1);
        this.guardar();
    },

    agregarObjetivo(nombre) {
        if (!nombre || !nombre.trim()) return;
        this.objetivos.push({ nombre: nombre.trim(), completado: false });
        this.guardar();
    },

    completarObjetivo(indice) {
        if (this.objetivos[indice]) {
            this.objetivos[indice].completado = true;
            this.guardar();
        }
    },

    eliminarObjetivo(indice) {
        this.objetivos.splice(indice, 1);
        this.guardar();
    },

    agregarHabito(nombre) {
        if (!nombre || !nombre.trim()) return;
        this.habitos.push({ nombre: nombre.trim(), registros: [] });
        this.guardar();
    },

    registrarHabito(indice) {
        const habito = this.habitos[indice];
        if (!habito) return;
        const hoy = new Date().toLocaleDateString("en-CA");
        if (!habito.registros.includes(hoy)) {
            habito.registros.push(hoy);
            this.guardar();
        } else {
            alert("¡Ya registraste este hábito hoy!");
        }
    },

    eliminarHabito(indice) {
        this.habitos.splice(indice, 1);
        this.guardar();
    },

    agregarMovimiento(tipo, cantidad, descripcion) {
        if (!["ingreso", "gasto"].includes(tipo) || isNaN(cantidad) || cantidad <= 0) return;
        this.movimientos.push({ tipo, cantidad, descripcion: descripcion || "Sin descripción" });
        this.guardar();
    }
};

// ============================================
//          CONTROLADORES DE LA INTERFAZ WEB
// ============================================

window.onload = function() {
    document.getElementById("fecha-actual").innerText = ATEMPORAL.fechaActual();
    renderizarTodo();
};

function agregarTareaWeb() {
    const input = document.getElementById("nueva-tarea");
    if (input && input.value.trim() !== "") {
        ATEMPORAL.agregarTarea(input.value);
        input.value = "";
        renderizarTodo();
    }
}
function completarTareaWeb(indice) {
    ATEMPORAL.completarTarea(indice);
    renderizarTodo();
}
function eliminarTareaWeb(indice) {
    ATEMPORAL.eliminarTarea(indice);
    renderizarTodo();
}

function agregarObjetivoWeb() {
    const input = document.getElementById("nuevo-objetivo");
    if (input && input.value.trim() !== "") {
        ATEMPORAL.agregarObjetivo(input.value);
        input.value = "";
        renderizarTodo();
    }
}
function completarObjetivoWeb(indice) {
    ATEMPORAL.completarObjetivo(indice);
    renderizarTodo();
}
function eliminarObjetivoWeb(indice) {
    ATEMPORAL.eliminarObjetivo(indice);
    renderizarTodo();
}

function agregarHabitoWeb() {
    const input = document.getElementById("nuevo-habito");
    if (input && input.value.trim() !== "") {
        ATEMPORAL.agregarHabito(input.value);
        input.value = "";
        renderizarTodo();
    }
}
function registrarHabitoWeb(indice) {
    ATEMPORAL.registrarHabito(indice);
    renderizarTodo();
}
function eliminarHabitoWeb(indice) {
    ATEMPORAL.eliminarHabito(indice);
    renderizarTodo();
}

function agregarMovimientoWeb() {
    const tipo = document.getElementById("tipo-movimiento").value;
    const cantidad = parseFloat(document.getElementById("cantidad-movimiento").value);
    const desc = document.getElementById("desc-movimiento").value;

    if (!isNaN(cantidad) && cantidad > 0) {
        ATEMPORAL.agregarMovimiento(tipo, cantidad, desc);
        document.getElementById("cantidad-movimiento").value = "";
        document.getElementById("desc-movimiento").value = "";
        renderizarTodo();
    }
}

function renderizarTodo() {
    // Tareas
    const listaT = document.getElementById("lista-tareas");
    if (listaT) {
        listaT.innerHTML = "";
        ATEMPORAL.tareas.forEach((t, i) => {
            const li = document.createElement("li");
            if (t.completada) li.className = "completada";
            li.innerHTML = `
                <span>${t.nombre}</span>
                <div class="actions-div">
                    ${!t.completada ? `<button class="btn-check" onclick="completarTareaWeb(${i})">✓</button>` : '🎉'}
                    <button class="btn-delete" onclick="eliminarTareaWeb(${i})">🗑️</button>
                </div>`;
            listaT.appendChild(li);
        });
    }

    // Objetivos
    const listaO = document.getElementById("lista-objetivos");
    if (listaO) {
        listaO.innerHTML = "";
        ATEMPORAL.objetivos.forEach((o, i) => {
            const li = document.createElement("li");
            if (o.completado) li.className = "completada";
            li.innerHTML = `
                <span>${o.nombre}</span>
                <div class="actions-div">
                    ${!o.completado ? `<button class="btn-check" onclick="completarObjetivoWeb(${i})">✓</button>` : '🏆'}
                    <button class="btn-delete" onclick="eliminarObjetivoWeb(${i})">🗑️</button>
                </div>`;
            listaO.appendChild(li);
        });
    }

    // Hábitos
    const listaH = document.getElementById("lista-habitos");
    if (listaH) {
        listaH.innerHTML = "";
        ATEMPORAL.habitos.forEach((h, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${h.nombre} <b>(${h.registros.length} d)</b></span>
                <div class="actions-div">
                    <button class="btn-check" onclick="registrarHabitoWeb(${i})">+1</button>
                    <button class="btn-delete" onclick="eliminarHabitoWeb(${i})">🗑️</button>
                </div>`;
            listaH.appendChild(li);
        });
    }

    // Finanzas
    const ingresos = ATEMPORAL.movimientos.filter(m => m.tipo === "ingreso").reduce((sum, m) => sum + m.cantidad, 0);
    const gastos = ATEMPORAL.movimientos.filter(m => m.tipo === "gasto").reduce((sum, m) => sum + m.cantidad, 0);
    const balance = ingresos - gastos;

    if (document.getElementById("fin-ingresos")) {
        document.getElementById("fin-ingresos").innerText = "S/ " + ingresos.toFixed(2);
        document.getElementById("fin-gasto").innerText = "S/ " + gastos.toFixed(2);
        document.getElementById("fin-balance").innerText = "S/ " + balance.toFixed(2);
    }
}
