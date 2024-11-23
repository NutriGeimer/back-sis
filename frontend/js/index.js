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
    const cantidad = prompt('¿Cuántos refreskos deseas comprar?');
    if (!cantidad || isNaN(cantidad)) {
        alert('Por favor, ingresa una cantidad válida.');
        return;
    }

    const response = await fetch(`${API_URL}/sales/add`, {
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
        loadSales(); // Actualiza las ventas después de la compra
        loadIncome(); // Actualiza los ingresos después de la compra
    } else {
        alert('Hubo un error al realizar la compra');
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
    incomeList.innerHTML = '';

    let totalIncome = 0;

    data.incomes.forEach(income => {
        const item = `<li class="list-group-item">$${income.totalIncome} - ${new Date(income.date).toLocaleString()}</li>`;
        incomeList.innerHTML += item;
        totalIncome += income.totalIncome;
    });

    document.getElementById('total-income').innerText = `$${totalIncome}`;
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