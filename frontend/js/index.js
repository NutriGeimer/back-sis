const API_URL = 'http://localhost:3020/api/v1';

// Cargar los clientes desde la API
async function loadCustomers() {
    const response = await fetch(`${API_URL}/client/all`);
    const data = await response.json();
    const customersList = document.getElementById('customers-list');
    customersList.innerHTML = '';

    data.clients.forEach(client => {
        const row = `
            <tr>
                <td>${client.name}</td>
                <td>${client.username}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
            </tr>
        `;
        customersList.innerHTML += row;
    });

    document.getElementById('total-clients').innerText = data.clients.length;
}

// Agregar un nuevo cliente
async function addClient() {
    const name = document.getElementById('client-name').value;
    const username = document.getElementById('client-username').value;
    const email = document.getElementById('client-email').value;
    const phone = document.getElementById('client-phone').value;

    const response = await fetch(`${API_URL}/client/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, phone }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Cliente agregado con éxito');
        loadCustomers();
    } else {
        alert('Hubo un error al agregar el cliente');
    }
}

// Mostrar formulario para agregar cliente
function showAddClientForm() {
    document.getElementById('add-client-form').style.display = 'block';
}

// Cargar los refreskos desde la API
async function loadRefreskos() {
    const response = await fetch(`${API_URL}/refresko/all`);
    const data = await response.json();
    const refreskosList = document.getElementById('refreskos-list');
    refreskosList.innerHTML = '';

    data.refreskos.forEach(refresko => {
        const card = `
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
                        <button class="btn btn-success mt-2" onclick="comprarRefresko('${refresko.id}')">Comprar</button>
                    </div>
                </div>
            </div>
        `;
        refreskosList.innerHTML += card;
    });

    document.getElementById('total-refreskos').innerText = data.refreskos.length;
}

// Agregar un nuevo refresko
async function addRefresko() {
    const productname = document.getElementById('refresko-name').value;
    const description = document.getElementById('refresko-description').value;
    const flavor = document.getElementById('refresko-flavor').value;
    const small = document.getElementById('refresko-small').value;
    const medium = document.getElementById('refresko-medium').value;
    const large = document.getElementById('refresko-large').value;

    const response = await fetch(`${API_URL}/refresko/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productname, description, flavor, small, medium, large }),
    });

    const result = await response.json();
    if (result.success) {
        alert('Refresko agregado con éxito');
        loadRefreskos();
    } else {
        alert('Hubo un error al agregar el refresko');
    }
}

// Mostrar formulario para agregar refresko
function showAddRefreskoForm() {
    document.getElementById('add-refresko-form').style.display = 'block';
}

// Función para comprar refresko y generar ingreso
async function comprarRefresko(refreskoId) {
    const sizeOptions = ['small', 'medium', 'large'];
    const selectedSize = prompt('¿Qué tamaño deseas comprar? (small, medium, large)').toLowerCase();

    if (!sizeOptions.includes(selectedSize)) {
        alert('Por favor, selecciona un tamaño válido: small, medium o large.');
        return;
    }

    const cantidad = prompt('¿Cuántos refreskos deseas comprar?');
    if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    // Obtener detalles del refresko desde la API para calcular el precio
    const refreskoResponse = await fetch(`${API_URL}/refresko/id/${refreskoId}`);
    const data = await refreskoResponse.json();
    console.log('Detalles del refresko:', data);

    let pricePerUnit;
    switch (selectedSize) {
        case 'small':
            pricePerUnit = data.refresko.small;
            break;
        case 'medium':
            pricePerUnit = data.refresko.medium;
            break;
        case 'large':
            pricePerUnit = data.refresko.large;
            break;
    }

    const totalPrice = pricePerUnit * parseInt(cantidad);
    console.log(`Precio total: $${totalPrice}`);
    console.log('Tamaño seleccionado:', selectedSize);
    console.log('Precio del tamaño seleccionado:', pricePerUnit);
    console.log('Cantidad ingresada:', cantidad)

    // Registrar la venta en la API
    const response = await fetch(`${API_URL}/sales/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            refreskoId: refreskoId,
            size: selectedSize,
            quantity: parseInt(cantidad),  // Asegurarnos de enviar la cantidad como número
            totalPrice: totalPrice
        }),
    });

    const result = await response.json();
    if (result.success) {
        alert(`Compra realizada con éxito: ${cantidad} refresko(s) tamaño ${selectedSize} por $${totalPrice}.`);
        loadSales(); // Actualiza las ventas después de la compra
        loadIncome(); // Actualiza los ingresos después de la compra
    } else {
        alert('Hubo un error al realizar la compra: ' + result.message);
    }
}

// Cargar las ventas desde la API
async function loadSales() {
    const response = await fetch(`${API_URL}/sales/all`);
    const data = await response.json();
    const salesList = document.getElementById('sales-list');
    salesList.innerHTML = '';

    data.sales.forEach(sale => {
        const row = `
            <tr>
                <td>${sale.refreskoId}</td>
                <td>${sale.size}</td>
                <td>${sale.quantity}</td>
                <td>$${sale.totalPrice}</td>
            </tr>
        `;
        salesList.innerHTML += row;
    });

    document.getElementById('total-sales').innerText = data.sales.length;
}

// Cargar los ingresos desde la API
async function loadIncome() {
    const response = await fetch(`${API_URL}/income/all`);
    const data = await response.json();
    const incomeList = document.getElementById('income-list');
    const totalIncomeElement = document.getElementById('total-income');
    incomeList.innerHTML = '';  // Limpiar la lista de ingresos

    let totalIncome = 0;

    // Crear filas de la tabla para cada ingreso
    data.incomes.forEach(income => {
        const row = `
            <tr>
                <td>${income.id}</td>
                <td>$${income.totalIncome}</td>
            </tr>
        `;
        incomeList.innerHTML += row;
        totalIncome += income.totalIncome;
    });

    // Actualizar el total de ingresos
    totalIncomeElement.innerText = `$${totalIncome}`;
}

// Inicializar el contenido por defecto al cargar la página
window.onload = function() {
    const path = window.location.pathname;
    if (path.includes('customers.html')) {
        loadCustomers();
    } else if (path.includes('refreskos.html')) {
        loadRefreskos();
    } else if (path.includes('sales.html')) {
        loadSales();
    } else if (path.includes('income.html')) {
        loadIncome();
    } else {
        loadDashboard();
    }
};

// Cargar el contenido del dashboard
async function loadDashboard() {
    await loadCustomers();
    await loadRefreskos();
    await loadSales();
    await loadIncome();
}