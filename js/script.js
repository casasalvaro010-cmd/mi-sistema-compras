// SISTEMA DE COMPRAS - JavaScript educativo
const USUARIO_DEMO = "admin";
const CLAVE_DEMO = "compras123";
const compras = [];

function formatoBs(valor) {
  return "Bs " + Number(valor).toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Validación del formulario de inicio de sesión
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("loginMensaje");

    if (usuario === "" || clave === "") {
      mensaje.textContent = "Error: completa el usuario y la contraseña.";
      return;
    }
    if (usuario !== USUARIO_DEMO || clave !== CLAVE_DEMO) {
      mensaje.textContent = "Usuario o contraseña incorrectos. Intenta nuevamente.";
      return;
    }
    sessionStorage.setItem("sesionCompras", "activa");
    window.location.href = "pages/inicio.html";
  });
}

// Menú adaptable para celulares
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("open");
  });
}

// Cerrar sesión
document.querySelectorAll("[data-logout]").forEach(function (boton) {
  boton.addEventListener("click", function () {
    sessionStorage.removeItem("sesionCompras");
    window.location.href = "../index.html";
  });
});

// Proteger las páginas internas en esta demostración
if (window.location.pathname.includes("/pages/") && sessionStorage.getItem("sesionCompras") !== "activa") {
  window.location.replace("../index.html");
}

// Formulario para registrar compras
const purchaseForm = document.getElementById("purchaseForm");
if (purchaseForm) {
  purchaseForm.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const producto = document.getElementById("producto").value.trim();
    const proveedor = document.getElementById("proveedor").value;
    const cantidad = Number(document.getElementById("cantidad").value);
    const precio = Number(document.getElementById("precio").value);
    const mensaje = document.getElementById("purchaseMessage");

    if (!producto || !proveedor || !document.getElementById("cantidad").value || !document.getElementById("precio").value) {
      mensaje.textContent = "Error: completa todos los campos.";
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0 || !Number.isFinite(precio) || precio <= 0) {
      mensaje.textContent = "La cantidad debe ser un entero positivo y el precio debe ser mayor que cero.";
      return;
    }

    compras.push({ producto, proveedor, cantidad, precio, total: cantidad * precio });
    mensaje.textContent = "";
    purchaseForm.reset();
    mostrarCompras();
  });

  purchaseForm.addEventListener("reset", function () {
    const mensaje = document.getElementById("purchaseMessage");
    if (mensaje) mensaje.textContent = "";
  });
}

function mostrarCompras() {
  const tabla = document.getElementById("purchaseTable");
  const recientes = document.getElementById("recentPurchases");
  const totalCompras = document.getElementById("totalCompras");
  const importeTotal = document.getElementById("importeTotal");
  const grandTotal = document.getElementById("grandTotal");
  const purchaseCount = document.getElementById("purchaseCount");
  const total = compras.reduce((suma, compra) => suma + compra.total, 0);

  if (tabla) {
    tabla.innerHTML = "";
    if (compras.length === 0) {
      tabla.innerHTML = '<tr><td colspan="6" class="empty-state">No hay compras registradas.</td></tr>';
    } else {
      compras.forEach(function (compra, indice) {
        const fila = document.createElement("tr");
        [compra.producto, compra.proveedor, compra.cantidad, formatoBs(compra.precio), formatoBs(compra.total)].forEach(function (dato) {
          const celda = document.createElement("td");
          celda.textContent = dato;
          fila.appendChild(celda);
        });
        const celdaAccion = document.createElement("td");
        const boton = document.createElement("button");
        boton.className = "delete-btn";
        boton.textContent = "Eliminar";
        boton.addEventListener("click", function () {
          compras.splice(indice, 1);
          mostrarCompras();
        });
        celdaAccion.appendChild(boton);
        fila.appendChild(celdaAccion);
        tabla.appendChild(fila);
      });
    }
  }

  if (recientes) {
    recientes.innerHTML = "";
    const ultimas = compras.slice(-5).reverse();
    if (!ultimas.length) {
      recientes.innerHTML = '<tr><td colspan="4" class="empty-state">Todavía no hay compras. Registra tu primera compra.</td></tr>';
    } else {
      ultimas.forEach(function (compra) {
        const fila = document.createElement("tr");
        [compra.producto, compra.proveedor, compra.cantidad, formatoBs(compra.total)].forEach(function (dato) {
          const celda = document.createElement("td");
          celda.textContent = dato;
          fila.appendChild(celda);
        });
        recientes.appendChild(fila);
      });
    }
  }
  if (totalCompras) totalCompras.textContent = compras.length;
  if (importeTotal) importeTotal.textContent = formatoBs(total);
  if (grandTotal) grandTotal.textContent = formatoBs(total);
  if (purchaseCount) purchaseCount.textContent = compras.length + (compras.length === 1 ? " registro" : " registros");
}
