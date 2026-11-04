"use strict";

const ATEMPORAL = {
    // Lee las tareas guardadas del almacenamiento del navegador
    tareas: JSON.parse(localStorage.getItem("at_tareas_matriz")) || [],

    guardar() {
        localStorage.setItem("at_tareas_matriz", JSON.stringify(this.tareas));
    },

    fechaActual() {
        return new Date().toLocaleDateString("es-PE", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    },

    // Agrega la tarea guardando si es importante, urgente y su fecha límite
    agregarTarea(nombre, fechaEntrega, esImportante, esUrgente) {
        if (!nombre || !nombre.trim()) return;
        
        this.tareas.push({
            nombre: nombre.trim(),
            fecha: fechaEntrega ? new Date(fechaEntrega).toLocaleString("es-PE") : "Sin fecha",
            importante: esImportante,
            urgente: esUrgente,
            completada: false
        });
        
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
    const inputNombre = document.getElementById("nueva-tarea");
    const inputFecha = document.getElementById("fecha-tarea");
    const checkImportante = document.getElementById("check-importante").checked;
    const checkUrgente = document.getElementById("check-urgente").checked;

    if (inputNombre && inputNombre.value.trim() !== "") {
        ATEMPORAL.agregarTarea(
            inputNombre.value,
            inputFecha.value,
            checkImportante,
            checkUrgente
        );

        // Resetear campos del formulario
        inputNombre.value = "";
        inputFecha.value = "";
        document.getElementById("check-importante").checked = false;
        document.getElementById("check-urgente").checked = false;

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

// Clasifica y dibuja automáticamente cada tarea en su respectivo cuadrante
function renderizarTodo() {
    const c1 = document.getElementById("lista-c1");
    const c2 = document.getElementById("lista-c2");
    const c3 = document.getElementById("lista-c3");
    const c4 = document.getElementById("lista-c4");

    // Limpiar listas visuales
    if(c1) c1.innerHTML = "";
    if(c2) c2.innerHTML = "";
    if(c3) c3.innerHTML = "";
    if(c4) c4.innerHTML = "";

    let counts = { c1: 0, c2: 0, c3: 0, c4: 0 };

    ATEMPORAL.tareas.forEach((tarea, i) => {
        const li = document.createElement("li");
        if (tarea.completada) li.className = "completada";

        li.innerHTML = `
            <div class="tarea-info">
                <span class="tarea-texto">${tarea.nombre}</span>
                <span class="tarea-fecha">📅 Entrega: ${tarea.fecha}</span>
            </div>
            <div class="actions-div">
                ${!tarea.completada ? `<button class="btn-check" onclick="completarTareaWeb(${i})">✓</button>` : '🎉'}
                <button class="btn-delete" onclick="eliminarTareaWeb(${i})">🗑️</button>
            </div>
        `;

        // Clasificación de forma automática usando condicionales cruzados
        if (tarea.importante && tarea.urgente) {
            c1.appendChild(li);
            counts.c1++;
        } else if (tarea.importante && !tarea.urgente) {
            c2.appendChild(li);
            counts.c2++;
        } else if (!tarea.importante && tarea.urgente) {
            c3.appendChild(li);
            counts.c3++;
        } else {
            c4.appendChild(li);
            counts.c4++;
        }
    });

    // Actualizar marcadores de cantidad numéricos
    if(document.getElementById("c1-count")) document.getElementById("c1-count").innerText = counts.c1;
    if(document.getElementById("c2-count")) document.getElementById("c2-count").innerText = counts.c2;
    if(document.getElementById("c3-count")) document.getElementById("c3-count").innerText = counts.c3;
    if(document.getElementById("c4-count")) document.getElementById("c4-count").innerText = counts.c4;
}
