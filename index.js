"use strict";

const ATEMPORAL = {
    // Almacenamiento local persistente de todas las variables originales
    tareas: JSON.parse(localStorage.getItem("at_web_tareas")) || [],
    objetivos: JSON.parse(localStorage.getItem("at_web_objetivos")) || [],
    habitos: JSON.parse(localStorage.getItem("at_web_habitos")) || [],
    movimientos: JSON.parse(localStorage.getItem("at_web_movimientos")) || [],
    puntos: parseInt(localStorage.getItem("at_web_puntos")) || 0,

    guardar() {
        localStorage.setItem("at_web_tareas", JSON.stringify(this.tareas));
        localStorage.setItem("at_web_objetivos", JSON.stringify(this.objetivos));
        localStorage.setItem("at_web_habitos", JSON.stringify(this.habitos));
        localStorage.setItem("at_web_movimientos", JSON.stringify(this.movimientos));
        localStorage.setItem("at_web_puntos", this.puntos.toString());
    },

    fechaActual() {
        return new Date().toLocaleDateString("es-PE", {
            weekday: "long", day: "numeric", month: "long", year: "numeric"
        });
    },

    agregarTarea(nombre, fechaEntrega, esImportante, esUrgente) {
        if (!nombre || !nombre.trim()) return;
        this.tareas.push({
            nombre: nombre.trim(),
            fechaLimite: fechaEntrega ? new Date(fechaEntrega).toISOString() : null,
            fechaTexto: fechaEntrega ? new Date(fechaEntrega).toLocaleString("es-PE") : "Sin fecha",
            importante: esImportante,
            urgente: esUrgente,
            completada: false,
            penalizada: false
        });
        this.guardar();
    },

    completarTarea(indice) {
        const tarea = this.tareas[indice];
        if (tarea && !tarea.completada) {
            tarea.completada = true;
            // Si no se venció, sumas +1 punto
            if (!(tarea.fechaLimite && new Date() > new Date(tarea.fechaLimite))) {
                this.puntos += 1;
            }
            this.guardar();
        }
    },

    agregarObjetivo(nombre) {
        if (!nombre || !nombre.trim()) return;
        this.objetivos.push({ nombre: nombre.trim(), completado: false });
        this.guardar();
    },

    completarObjetivo(indice) {
        if (this.objetivos[indice] && !this.objetivos[indice].completado) {
            this.objetivos[indice].completado = true;
            this.puntos += 5; // Un objetivo mayor te otorga un súper bono de +5 puntos!
            this.guardar();
        }
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
            this.puntos += 1; // Registrar tu hábito diario te da +1 punto
            this.guardar();
        } else {
            alert("¡Ya registraste este hábito hoy!");
        }
    },

    agregarMovimiento(tipo, cantidad, descripcion) {
        if (!["ingreso", "gasto"].includes(tipo) || isNaN(cantidad) || cantidad <= 0) return;
        this.movimientos.push({ tipo, cantidad, descripcion: descripcion || "Sin descripción" });
        this.guardar();
    },

    verificarVencimientos() {
        let huboCambios = false;
        const ahora = new Date();
        this.tareas.forEach(t => {
            if (!t.completada && !t.penalizada && t.fechaLimite) {
                if (ahora > new Date(t.fechaLimite)) {
                    t.penalizada = true;
                    this.puntos -= 2; // Penalización automática de -2 puntos
                    huboCambios = true;
                }
            }
        });
        if (huboCambios) {
            this.guardar();
            renderizarTodo();
        }
    }
};

// ============================================
//          CONTROLADORES DE INTERFAZ
// ============================================

window.onload = function() {
    document.getElementById("fecha-actual").innerText = ATEMPORAL.fechaActual();
    renderizarTodo();
    setInterval(() => { ATEMPORAL.verificarVencimientos(); }, 4000);
};

function agregarTareaWeb() {
    const nom = document.getElementById("nueva-tarea");
    const fec = document.getElementById("fecha-tarea");
    const imp = document.getElementById("select-importante").value === "si";
    const urg = document.getElementById("select-urgente").value === "si";

    if (nom && nom.value.trim() !== "") {
        ATEMPORAL.agregarTarea(nom.value, fec.value, imp, urg);
        nom.value = "";
        fec.value = "";
        renderizarTodo();
    }
}

function completarTareaWeb(i) { ATEMPORAL.completarTarea(i); renderizarTodo(); }
function agregarObjetivoWeb() {
    const input = document.getElementById("nuevo-objetivo");
    if (input && input.value.trim() !== "") { ATEMPORAL.agregarObjetivo(input.value); input.value = ""; renderizarTodo(); }
}
function completarObjetivoWeb(i) { ATEMPORAL.completarObjetivo(i); renderizarTodo(); }
function agregarHabitoWeb() {
    const input = document.getElementById("nuevo-habito");
    if (input && input.value.trim() !== "") { ATEMPORAL.agregarHabito(input.value); input.value = ""; renderizarTodo(); }
}
function registrarHabitoWeb(i) { ATEMPORAL.registrarHabito(i); renderizarTodo(); }

function agregarMovimientoWeb() {
    const tipo = document.getElementById("tipo-movimiento").value;
    const cant = parseFloat(document.getElementById("cantidad-movimiento").value);
    const desc = document.getElementById("desc-movimiento").value;
    if (!isNaN(cant) && cant > 0) {
        ATEMPORAL.agregarMovimiento(tipo, cant, desc);
        document.getElementById("cantidad-movimiento").value = "";
        document.getElementById("desc-movimiento").value = "";
        renderizarTodo();
    }
}

function renderizarTodo() {
    // Render de Puntos y Rangos Dinámicos
    if(document.getElementById("puntos-total")) document.getElementById("puntos-total").innerText = ATEMPORAL.puntos;
    if(document.getElementById("rango-jugador")) {
        let rango = "Novato";
        if (ATEMPORAL.puntos >= 30) rango = "Productivo Leyenda 🏆";
        else if (ATEMPORAL.puntos >= 15) rango = "Enfoque Avanzado ⭐";
        else if (ATEMPORAL.puntos >= 5) rango = "Iniciado Activo ⚡";
        document.getElementById("rango-jugador").innerText = rango;
    }

    // Render de Tareas con Clasificación de Etiquetas Visuales
    const listaT = document.getElementById("lista-tareas");
    if (listaT) {
        listaT.innerHTML = "";
        const ahora = new Date();
        ATEMPORAL.tareas.forEach((t, i) => {
            const li = document.createElement("li");
            if (t.completada) li.className = "completada";
            else if (t.fechaLimite && ahora > new Date(t.fechaLimite)) li.className = "vencida";

            // Determinar etiqueta cruzada de importancia
            let tag = `[${t.importante ? 'Importante' : 'No Importante'} | ${t.urgente ? 'Urgente' : 'No Urgente'}]`;

            li.innerHTML = `
                <div>
                    <span><b>${tag}</b> ${t.nombre}</span><br>
                    <small style="color:var(--text-muted)">📅 Límite: ${t.fechaTexto} ${t.penalizada ? '⚠️ (Vencida -2 Puntos)' : ''}</small>
                </div>
                <div>${!t.completada ? `<button class="btn-check" onclick="completarTareaWeb(${i})">✓</button>` : '🎉'}</div>
            `;
            listaT.appendChild(li);
        });
    }

    // Render de Objetivos
    const listaO = document.getElementById("lista-objetivos");
    if (listaO) {
        listaO.innerHTML = "";
        ATEMPORAL.objetivos.forEach((o, i) => {
            const li = document.createElement("li");
            if (o.completado) li.className = "completada";
            li.innerHTML = `<span>${o.nombre}</span> <div>${!o.completado ? `<button class="btn-check" onclick="completarObjetivoWeb(${i})">✓</button>` : '🏆'}</div>`;
            listaO.appendChild(li);
        });
    }

    // Render de Hábitos
    const listaH = document.getElementById("lista-habitos");
    if (listaH) {
        listaH.innerHTML = "";
        ATEMPORAL.habitos.forEach((h, i) => {
            const li = document.createElement("li");
            li.innerHTML = `<span>${h.nombre} <b>(${h.registros.length} d)</b></span> <button class="btn-check" onclick="registrarHabitoWeb(${i})">+1 d</button>`;
            listaH.appendChild(li);
        });
    }

    // Render de Finanzas Calculadas
    const ingresos = ATEMPORAL.movimientos.filter(m => m.tipo === "ingreso").reduce((sum, m) => sum + m.cantidad, 0);
    const gastos = ATEMPORAL.movimientos.filter(m => m.tipo === "gasto").reduce((sum, m) => sum + m.cantidad, 0);
    document.getElementById("fin-ingresos").innerText = "S/ " + ingresos.toFixed(2);
    document.getElementById("fin-gasto").innerText = "S/ " + gastos.toFixed(2);
    document.getElementById("fin-balance").innerText = "S/ " + (ingresos - gastos).toFixed(2);
}
