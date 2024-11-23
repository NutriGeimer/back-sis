// Variables para manejar caché
let refreskosCache = [];
let empleadosCache = [];
let ingresosCache = [];

// Cargar los refreskos desde la API
async function loadRefreskos() {
    if (refreskosCache.length === 0) {
        const response = await fetch('http://localhost:3020/api/v1/refresko/all');
        refreskosCache = await response.json();
    }

    const refreskosList = document.getElementById('refreskos-list');
    refreskosList.innerHTML = '';

    refreskosCache.forEach((refresko) => {
        const refreskoCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${refresko.imageUrl}" class="card-img-top" alt="${refresko.productname}">
                    <div class="card-body">
                        <h5 class="card-title">${refresko.productname}</h5>
                        <p class="card-text">${refresko.description}</p>
                        <ul class="list-group">
                            <li class="list-group-item">Sabor: ${refresko.flavor}</li>
                            <li class="list-group-item">Tamaño chico: $${refresko.small}</li>
                            <li class="list-group-item">Tamaño mediano: $${refresko.medium}</li>
                            <li class="list-group-item">Tamaño grande: $${refresko.large}</li>
                        </ul>
                        <button class="btn btn-success" onclick="comprarRefresko(${refresko.id})">Comprar</button>
                    </div>
                </div>
            </div>
        `;
        refreskosList.innerHTML += refreskoCard;
    });
}

// Función para comprar refresko y generar ingreso
async function comprarRefresko(refreskoId) {
    const cantidad = prompt('¿Cuántos refreskos deseas comprar?');
    if (!cantidad || isNaN(cantidad)) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    const response = await fetch('http://localhost:3020/api/v1/sales/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreskoId: refreskoId,
            size: 'mediano', // Aquí deberías agregar un selector de tamaño
            quantity: cantidad,
            totalPrice: 10 * cantidad, // Suponiendo un precio por refresco
        }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Compra realizada con éxito');
        ingresosCache = []; // Invalidar la caché
        loadIngresos(); // Actualiza los ingresos después de la compra
    } else {
        alert('Hubo un error al realizar la compra');
    }
}

// Cargar los empleados desde la API
async function loadEmpleados() {
    if (empleadosCache.length === 0) {
        const response = await fetch('http://localhost:3020/api/v1/employee/all');
        empleadosCache = await response.json();
    }

    const empleadosList = document.getElementById('empleados-list');
    empleadosList.innerHTML = '';

    empleadosCache.forEach((empleado) => {
        const empleadoRow = `
            <tr>
                <td>${empleado.fullname}</td>
                <td>${empleado.email}</td>
                <td>${empleado.phone}</td>
                <td>${empleado.address}</td>
                <td>${empleado.rfc}</td>
                <td>$${empleado.salary}</td>
                <td>
                    <button class="btn btn-primary" onclick="actualizarEmpleado(${empleado.id})">Actualizar</button>
                    <button class="btn btn-danger" onclick="eliminarEmpleado(${empleado.id})">Eliminar</button>
                </td>
            </tr>
        `;
        empleadosList.innerHTML += empleadoRow;
    });
}

// Función para eliminar empleado
async function eliminarEmpleado(empleadoId) {
    const confirmDelete = confirm('¿Estás seguro de que quieres eliminar a este empleado?');
    if (!confirmDelete) return;

    const response = await fetch(`http://localhost:3020/api/v1/employee/${empleadoId}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    if (result.success) {
        alert('Empleado eliminado con éxito');
        empleadosCache = []; // Invalidar la caché
        loadEmpleados(); // Actualiza la lista de empleados
    } else {
        alert('Hubo un error al eliminar el empleado');
    }
}

// Función para actualizar empleado
async function actualizarEmpleado(empleadoId) {
    const newSalary = prompt('Ingresa el nuevo salario para el empleado');
    if (!newSalary || isNaN(newSalary)) {
        alert('Por favor, ingresa un salario válido.');
        return;
    }

    const response = await fetch(`http://localhost:3020/api/v1/employee/update/${empleadoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            salary: newSalary,
        }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Salario actualizado con éxito');
        empleadosCache = []; // Invalidar la caché
        loadEmpleados(); // Actualiza la lista de empleados
    } else {
        alert('Hubo un error al actualizar el salario');
    }
}

// Cargar los ingresos desde la API
async function loadIngresos() {
    if (ingresosCache.length === 0) {
        const response = await fetch('http://localhost:3020/api/v1/income/all');
        ingresosCache = await response.json();
    }

    const ingresosList = document.getElementById('ingresos-list');
    ingresosList.innerHTML = '';

    let totalIngresos = 0;

    ingresosCache.forEach((ingreso) => {
        ingresosList.innerHTML += `<li>$${ingreso.totalIncome} - ${new Date(ingreso.date).toLocaleString()}</li>`;
        totalIngresos += ingreso.totalIncome;
    });

    document.getElementById('total-ingresos').innerText = `$${totalIngresos}`;
}

// Función para mostrar la imagen del dashboard inicial
function showDashboardImage() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="text-center mt-5">
            <img src="/images/dashboard.jpg" alt="Dashboard principal" style="width: 100%; max-width: 800px; height: auto;" />
        </div>
    `;
}

// Función para cargar contenido dinámico según la sección seleccionada
function loadContent(section) {
    const content = document.getElementById('content');
    if (section === 'refreskos') {
        content.innerHTML = `
            <h2>Refreskos Disponibles</h2>
            <div id="refreskos-list" class="row">
                <!-- Los refrescos se cargarán aquí dinámicamente -->
            </div>
        `;
        loadRefreskos();  // Llamar a la función que carga refrescos
    } else if (section === 'empleados') {
        content.innerHTML = `
            <h2>Lista de Empleados</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>RFC</th>
                        <th>Salario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="empleados-list">
                    <!-- Los empleados se cargarán aquí dinámicamente -->
                </tbody>
            </table>
        `;
        loadEmpleados();  // Llamar a la función que carga empleados
    } else if (section === 'ingresos') {
        content.innerHTML = `
            <h2>Lista de Ingresos</h2>
            <ul id="ingresos-list" class="list-group">
                <!-- Los ingresos se cargarán aquí dinámicamente -->
            </ul>
            <h3>Total de Ingresos: <span id="total-ingresos">$0</span></h3>
        `;
        loadIngresos();  // Llamar a la función que carga ingresos
    } else {
        showDashboardImage();  // Mostrar la imagen del dashboard si no hay sección seleccionada
    }
}

// Agregar los eventos a los enlaces de navegación
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const section = event.target.getAttribute('href').substring(1); // Obtener la sección de la URL
        loadContent(section);  // Cargar el contenido de la sección
    });
});

// Inicializar el contenido por defecto al cargar la página
window.onload = function() {
    loadContent('dashboard');
};
