// Cargar los refreskos desde la API
async function loadRefreskos() {
    const response = await fetch('http://localhost:3020/api/v1/refreskos');
    const refreskos = await response.json();
    
    const refreskosList = document.getElementById('refreskos-list');
    refreskosList.innerHTML = '';

    refreskos.forEach(refresko => {
        const refreskoCard = `
            <div class="col-md-4">
                <div class="card">
                    <img src="${refresko.imageUrl}" class="card-img-top" alt="${refresko.name}">
                    <div class="card-body">
                        <h5 class="card-title">${refresko.name}</h5>
                        <p class="card-text">${refresko.description}</p>
                        <ul class="list-group">
                            <li class="list-group-item">Sabor: ${refresko.flavor}</li>
                            ${refresko.sizes.map(size => 
                                `<li class="list-group-item">Tamaño: ${size} - $${refresko.prices[size]}</li>`
                            ).join('')}
                        </ul>
                        <button class="btn btn-success" onclick="comprarRefresko(${refresko.id})">Comprar</button>
                    </div>
                </div>
            </div>
        `;
        refreskosList.innerHTML += refreskoCard;
    });
}

// Cargar los empleados desde la API
async function loadEmpleados() {
    const response = await fetch('http://localhost:3020/api/v1/employee');
    const empleados = await response.json();
    
    const empleadosList = document.getElementById('empleados-list');
    empleadosList.innerHTML = '';

    empleados.forEach(empleado => {
        empleadosList.innerHTML += `<li>${empleado.name}</li>`;
    });
}

// Cargar los ingresos desde la API
async function loadIngresos() {
    const response = await fetch('http://localhost:3020/api/v1/income');
    const ingresos = await response.json();
    
    const ingresosList = document.getElementById('ingresos-list');
    ingresosList.innerHTML = '';

    let totalIngresos = 0;

    ingresos.forEach(ingreso => {
        ingresosList.innerHTML += `<li>$${ingreso.amount} - ${new Date(ingreso.date).toLocaleString()}</li>`;
        totalIngresos += ingreso.amount;
    });

    document.getElementById('total-ingresos').innerText = `$${totalIngresos}`;
}

// Función para comprar refresco y generar ingreso
async function comprarRefresko(refreskoId) {
    const cantidad = prompt("¿Cuántos refreskos deseas comprar?");
    if (!cantidad || isNaN(cantidad)) {
        alert("Por favor, ingresa una cantidad válida.");
        return;
    }

    const response = await fetch('http://localhost:3020/api/v1/sales/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refreskoId: refreskoId,
            size: 'mediano', // Aquí deberías agregar un selector de tamaño
            quantity: cantidad,
            totalPrice: 10 * cantidad // Suponiendo un precio por refresco
        })
    });

    const result = await response.json();
    if (result.success) {
        alert("Compra realizada con éxito");
        loadIngresos(); // Actualiza los ingresos después de la compra
    } else {
        alert("Hubo un error al realizar la compra");
    }
}

// Inicializar las funciones
window.onload = function() {
    loadRefreskos();
    loadEmpleados();
    loadIngresos();
};
