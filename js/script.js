const arrayHobbies = [];

// ── OBJETO QUE ALMACENA LOS DATOS DEL USUARIO ───────────────
// Se construye al final cuando el formulario es válido.
let datosUsuario = {
    username:  "",
    password:  "",
    direccion: "",
    comuna:    "",
    telefono:  "",
    web:       "",
    hobbies:   []
};

function agregarHobby() {
    const input   = document.getElementById("hobby");
    const msgDiv  = document.getElementById("hobby-msg");
    const texto   = input.value.trim();

    // Validar que no esté vacío
    if (texto === "") {
        mostrarError("hobby-msg", "Escribe una afición antes de agregar.");
        return;
    }

    // Validar que no esté duplicada (sin distinguir mayúsculas)
    for (let i = 0; i < arrayHobbies.length; i++) {
        if (arrayHobbies[i].toLowerCase() === texto.toLowerCase()) {
            mostrarError("hobby-msg", "Esa afición ya fue agregada.");
            return;
        }
    }

    // Agregar al arreglo y refrescar la UI
    arrayHobbies.push(texto);
    limpiarError("hobby-msg");
    actualizarListaHobbies();
    input.value = "";
    input.focus();
}

/**
 * Elimina una afición del arreglo por su índice.
 * Se llama desde el botón "×" de cada ítem de la lista.
 */
function eliminarHobby(indice) {
    arrayHobbies.splice(indice, 1);
    actualizarListaHobbies();
}

/**
 * Reconstruye la lista <ul> en el DOM desde el arreglo arrayHobbies.
 */
function actualizarListaHobbies() {
    const ul    = document.getElementById("hobby-list");
    const count = document.getElementById("hobbies-count");
    ul.innerHTML = "";

    // Si no hay hobbies, mostrar placeholder
    if (arrayHobbies.length === 0) {
        const li = document.createElement("li");
        li.id        = "hobby-vacio";
        li.className = "hobby-placeholder";
        li.innerText = "Aún no has agregado aficiones...";
        ul.appendChild(li);
        count.innerText = "";
        return;
    }

    // Crear un <li> por cada hobby con botón de eliminar
    for (let i = 0; i < arrayHobbies.length; i++) {
        const li  = document.createElement("li");
        li.className = "hobby-item";

        const span = document.createElement("span");
        span.className = "hobby-texto";
        span.innerText = arrayHobbies[i];

        const btnEliminar = document.createElement("button");
        btnEliminar.type      = "button";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.innerText = "×";
        btnEliminar.title     = "Eliminar afición";
        // Captura el índice actual con una función envolvente
        btnEliminar.onclick = (function(idx) {
            return function() { eliminarHobby(idx); };
        })(i);

        li.appendChild(span);
        li.appendChild(btnEliminar);
        ul.appendChild(li);
    }

    // Contador informativo
    const faltantes = arrayHobbies.length < 2 ? (2 - arrayHobbies.length) + " más requerida(s)" : "✓ Mínimo alcanzado";
    count.innerText = arrayHobbies.length + " afición(es) — " + faltantes;
}

// Permitir agregar con la tecla Enter en el campo de hobby
document.addEventListener("DOMContentLoaded", function() {
    const inputHobby = document.getElementById("hobby");
    if (inputHobby) {
        inputHobby.addEventListener("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                agregarHobby();
            }
        });
    }
});


function validarUsername() {
    const valor = document.getElementById("username").value.trim();
    const letras  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitos = "0123456789";

    if (valor === "") {
        return marcarInvalido("username", "username-msg", "El nombre de usuario es obligatorio.");
    }
    if (valor.length < 5 || valor.length > 10) {
        return marcarInvalido("username", "username-msg", "Debe tener entre 5 y 10 caracteres.");
    }

    // Primer carácter debe ser letra
    if (letras.indexOf(valor[0]) === -1) {
        return marcarInvalido("username", "username-msg", "Debe comenzar con una letra.");
    }

    // Recorrer todos los caracteres: verificar que sean solo letras o dígitos
    for (let i = 0; i < valor.length; i++) {
        if (letras.indexOf(valor[i]) === -1 && digitos.indexOf(valor[i]) === -1) {
            return marcarInvalido("username", "username-msg", "Solo se permiten letras y números (sin acentos ni símbolos).");
        }
    }

    let empezaronDigitos = false;
    for (let i = 0; i < valor.length; i++) {
        const esDigito = digitos.indexOf(valor[i]) !== -1;
        const esLetra  = letras.indexOf(valor[i]) !== -1;

        if (esDigito) {
            empezaronDigitos = true;
        } else if (esLetra && empezaronDigitos) {
            // Hay una letra después de un dígito → inválido
            return marcarInvalido("username", "username-msg", "Los dígitos solo pueden aparecer al final del nombre.");
        }
    }

    return marcarValido("username", "username-msg", "✓ Usuario válido");
}

function validarPassword() {
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim().toLowerCase();
    const letras   = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digitos  = "0123456789";

    if (password === "") {
        return marcarInvalido("password", "password-msg", "La contraseña es obligatoria.");
    }
    if (password.length < 3 || password.length > 6) {
        return marcarInvalido("password", "password-msg", "Debe tener entre 3 y 6 caracteres.");
    }

    // Al menos una letra
    let tieneLetra  = false;
    let tieneDigito = false;
    for (let i = 0; i < password.length; i++) {
        if (letras.indexOf(password[i]) !== -1)  tieneLetra  = true;
        if (digitos.indexOf(password[i]) !== -1) tieneDigito = true;
    }
    if (!tieneLetra) {
        return marcarInvalido("password", "password-msg", "Debe contener al menos una letra.");
    }
    if (!tieneDigito) {
        return marcarInvalido("password", "password-msg", "Debe contener al menos un dígito.");
    }

    // No puede contener el nombre de usuario (comparación sin mayúsculas)
    if (username !== "" && password.toLowerCase().indexOf(username) !== -1) {
        return marcarInvalido("password", "password-msg", "La contraseña no puede contener el nombre de usuario.");
    }

    return marcarValido("password", "password-msg", "✓ Contraseña válida");
}

/**
 * Valida que la confirmación de contraseña coincida.
 */
function validarConfirmacion() {
    const password   = document.getElementById("password").value;
    const rePassword = document.getElementById("re-password").value;

    if (rePassword === "") {
        return marcarInvalido("re-password", "re-password-msg", "Debes confirmar la contraseña.");
    }
    if (rePassword !== password) {
        return marcarInvalido("re-password", "re-password-msg", "Las contraseñas no coinciden.");
    }

    return marcarValido("re-password", "re-password-msg", "✓ Las contraseñas coinciden");
}

/**
 * Valida la dirección: campo obligatorio.
 */
function validarDireccion() {
    const valor = document.getElementById("direccion").value.trim();

    if (valor === "") {
        return marcarInvalido("direccion", "direccion-msg", "La dirección postal es obligatoria.");
    }
    if (valor.length < 5) {
        return marcarInvalido("direccion", "direccion-msg", "Ingresa una dirección más completa.");
    }

    return marcarValido("direccion", "direccion-msg", "✓ Dirección válida");
}

/**
 * Valida que se haya seleccionado una comuna.
 */
function validarComuna() {
    const valor = document.getElementById("comuna").value;

    if (valor === "") {
        return marcarInvalidoSelect("comuna", "comuna-msg", "Debes seleccionar una comuna.");
    }

    limpiarError("comuna-msg");
    document.getElementById("comuna").classList.remove("invalido");
    return true;
}


function validarTelefono() {
    const valor   = document.getElementById("telefono").value.trim();
    const digitos = "0123456789";

    if (valor === "") {
        return marcarInvalido("telefono", "telefono-msg", "El número de teléfono es obligatorio.");
    }

    // Debe comenzar con +56
    if (valor.length < 3 || valor[0] !== "+" || valor[1] !== "5" || valor[2] !== "6") {
        return marcarInvalido("telefono", "telefono-msg", "Debe comenzar con +56 (Ej: +56912345678).");
    }

    // Después de "+56" deben haber exactamente 9 dígitos
    const resto = valor.substring(3); // todo lo que viene después de "+56"
    if (resto.length !== 9) {
        return marcarInvalido("telefono", "telefono-msg", "Después de +56 deben ir exactamente 9 dígitos.");
    }
    for (let i = 0; i < resto.length; i++) {
        if (digitos.indexOf(resto[i]) === -1) {
            return marcarInvalido("telefono", "telefono-msg", "El teléfono solo puede contener dígitos después de +56.");
        }
    }

    return marcarValido("telefono", "telefono-msg", "✓ Teléfono válido");
}


function validarWeb() {
    const valor = document.getElementById("web").value.trim();

    // Campo opcional: si está vacío, es válido
    if (valor === "") {
        limpiarError("web-msg");
        document.getElementById("web").classList.remove("invalido", "valido");
        return true;
    }

    // Verificar que no tenga espacios
    for (let i = 0; i < valor.length; i++) {
        if (valor[i] === " ") {
            return marcarInvalido("web", "web-msg", "La URL no puede contener espacios.");
        }
    }

    // Verificar prefijo http:// o https://
    const tieneHttp  = valor.length >= 7  && valor.substring(0, 7)  === "http://";
    const tieneHttps = valor.length >= 8  && valor.substring(0, 8)  === "https://";

    if (!tieneHttp && !tieneHttps) {
        return marcarInvalido("web", "web-msg", "La URL debe comenzar con http:// o https://");
    }

    // Verificar que haya algo después del prefijo con al menos un punto
    const dominio = tieneHttps ? valor.substring(8) : valor.substring(7);
    if (dominio.length < 3) {
        return marcarInvalido("web", "web-msg", "La URL parece incompleta.");
    }
    let tienePunto = false;
    for (let i = 0; i < dominio.length; i++) {
        if (dominio[i] === ".") { tienePunto = true; break; }
    }
    if (!tienePunto) {
        return marcarInvalido("web", "web-msg", "La URL debe tener un dominio válido (ej: .cl, .com).");
    }

    return marcarValido("web", "web-msg", "✓ URL válida");
}

/**
 * Valida que haya al menos 2 aficiones en el arreglo.
 */
function validarHobbies() {
    if (arrayHobbies.length < 2) {
        mostrarError("hobby-msg", "Debes agregar al menos 2 aficiones.");
        return false;
    }
    limpiarError("hobby-msg");
    return true;
}



function validar() {
    const okUsername     = validarUsername();
    const okPassword     = validarPassword();
    const okConfirmacion = validarConfirmacion();
    const okDireccion    = validarDireccion();
    const okComuna       = validarComuna();
    const okTelefono     = validarTelefono();
    const okWeb          = validarWeb();
    const okHobbies      = validarHobbies();

    const todoValido = okUsername && okPassword && okConfirmacion &&
                       okDireccion && okComuna && okTelefono && okWeb && okHobbies;

    if (todoValido) {
        construirObjeto();
        mostrarExito();
    } else {
        // Hacer scroll al primer error visible
        const primerError = document.querySelector(".msg-error:not(:empty)");
        if (primerError) {
            primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    return false; // Evita el envío real del formulario
}

/**
 * Construye el objeto datosUsuario con los valores validados.
 * Esto cumple el requisito de la rúbrica: "Uso de objetos".
 */
function construirObjeto() {
    datosUsuario.username  = document.getElementById("username").value.trim();
    datosUsuario.password  = document.getElementById("password").value;
    datosUsuario.direccion = document.getElementById("direccion").value.trim();
    datosUsuario.comuna    = document.getElementById("comuna").value;
    datosUsuario.telefono  = document.getElementById("telefono").value.trim();
    datosUsuario.web       = document.getElementById("web").value.trim();
    datosUsuario.hobbies   = arrayHobbies.slice(); // copia del arreglo

    // Mostrar en consola para verificación (útil en pruebas)
    console.log("Objeto datosUsuario:", datosUsuario);
}


// ════════════════════════════════════════════════════════════
//  SECCIÓN 4 — PANEL DE ÉXITO Y LIMPIEZA
// ════════════════════════════════════════════════════════════

/**
 * Oculta el formulario y muestra el panel de éxito con un resumen.
 */
function mostrarExito() {
    document.getElementById("form-registro").style.display = "none";

    const resumen = document.getElementById("resumen-datos");
    resumen.innerHTML =
        "<strong>Usuario:</strong> "  + datosUsuario.username  + "<br>" +
        "<strong>Dirección:</strong> " + datosUsuario.direccion + "<br>" +
        "<strong>Comuna:</strong> "    + datosUsuario.comuna    + "<br>" +
        "<strong>Teléfono:</strong> "  + datosUsuario.telefono  + "<br>" +
        (datosUsuario.web ? "<strong>Web:</strong> " + datosUsuario.web + "<br>" : "") +
        "<strong>Aficiones:</strong> " + datosUsuario.hobbies.join(", ");

    document.getElementById("panel-exito").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Muestra el formulario nuevamente y resetea todo para un nuevo registro.
 */
function nuevoRegistro() {
    // Vaciar arreglo y objeto
    arrayHobbies.length = 0;
    datosUsuario = { username: "", password: "", direccion: "", comuna: "", telefono: "", web: "", hobbies: [] };

    // Mostrar formulario, ocultar panel
    document.getElementById("form-registro").style.display = "block";
    document.getElementById("panel-exito").style.display   = "none";

    // Reset del formulario HTML
    document.getElementById("form-registro").reset();
    actualizarListaHobbies();
    limpiarTodosLosMensajes();
}

/**
 * Limpia el formulario visualmente al presionar "Limpiar".
 */
function limpiarTodo() {
    arrayHobbies.length = 0;
    actualizarListaHobbies();
    limpiarTodosLosMensajes();

    // Quitar clases de validación visual de todos los inputs
    const controles = document.querySelectorAll(".form-control, .form-select");
    for (let i = 0; i < controles.length; i++) {
        controles[i].classList.remove("valido", "invalido");
    }
}

/**
 * Borra el texto de todos los divs de mensajes de error.
 */
function limpiarTodosLosMensajes() {
    const ids = ["username-msg", "password-msg", "re-password-msg",
                 "direccion-msg", "comuna-msg", "telefono-msg", "web-msg", "hobby-msg"];
    for (let i = 0; i < ids.length; i++) {
        const div = document.getElementById(ids[i]);
        if (div) { div.innerText = ""; div.className = "msg-error"; }
    }
}


function marcarInvalido(inputId, msgId, mensaje) {
    const input = document.getElementById(inputId);
    const div   = document.getElementById(msgId);
    if (input) { input.classList.add("invalido"); input.classList.remove("valido"); }
    if (div)   { div.innerText = mensaje; div.className = "msg-error"; }
    return false;
}

/**
 * Variante para <select> (no aplica la clase "valido" con ícono).
 */
function marcarInvalidoSelect(selectId, msgId, mensaje) {
    const sel = document.getElementById(selectId);
    const div = document.getElementById(msgId);
    if (sel) { sel.classList.add("invalido"); }
    if (div) { div.innerText = mensaje; div.className = "msg-error"; }
    return false;
}

/**
 * Marca un input como válido: borde verde + mensaje de ok.
 * Retorna true.
 */
function marcarValido(inputId, msgId, mensaje) {
    const input = document.getElementById(inputId);
    const div   = document.getElementById(msgId);
    if (input) { input.classList.remove("invalido"); input.classList.add("valido"); }
    if (div)   { div.innerText = mensaje; div.className = "msg-error msg-ok"; }
    return true;
}

/**
 * Muestra un mensaje de error en un div (sin afectar clases de un input).
 */
function mostrarError(msgId, mensaje) {
    const div = document.getElementById(msgId);
    if (div) { div.innerText = mensaje; div.className = "msg-error"; }
}

/**
 * Limpia el texto de un div de mensaje.
 */
function limpiarError(msgId) {
    const div = document.getElementById(msgId);
    if (div) { div.innerText = ""; div.className = "msg-error"; }
}
