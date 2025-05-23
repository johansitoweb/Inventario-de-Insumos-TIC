document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    const itemListComponent = document.getElementById('item-list');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const requestForm = document.getElementById('request-form');
    const requestMessage = document.getElementById('request-message');
    const reportForm = document.getElementById('report-form');
    const reportMessage = document.getElementById('report-message');
    const userRequestsList = document.getElementById('user-requests-list');

 
    const inventory = [
        { id: 'mon001', name: 'Monitor LED 24"', category: 'Hardware', stock: 15, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Monitor' },
        { id: 'tec002', name: 'Teclado Mecánico RGB', category: 'Periférico', stock: 10, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Teclado' },
        { id: 'rat003', name: 'Ratón Inalámbrico Ergonómico', category: 'Periférico', stock: 20, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Raton' },
        { id: 'ton004', name: 'Tóner HP LaserJet Pro', category: 'Consumible', stock: 8, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Toner' },
        { id: 'sof005', name: 'Licencia MS Office 365', category: 'Software', stock: 'Disponible', imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Software' },
        { id: 'cab006', name: 'Cable HDMI 2m', category: 'Accesorio', stock: 30, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Cable+HDMI' },
        { id: 'lap007', name: 'Laptop Dell Latitude i7', category: 'Hardware', stock: 5, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Laptop' },
        { id: 'imp008', name: 'Impresora Multifuncional Epson', category: 'Hardware', stock: 3, imageUrl: 'https://via.placeholder.com/150/007bff/FFFFFF?text=Impresora' }
    ];

    let userRequests = JSON.parse(localStorage.getItem('userRequests')) || [];

  
    const showSection = (id) => {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(id).classList.add('active');

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active-link');
            }
        });
    };

  
    showSection('inventario');

    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    
    const renderInventory = (items) => {
        itemListComponent.innerHTML = ''; 
        if (items.length === 0) {
            itemListComponent.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No se encontraron insumos.</p>';
            return;
        }
        items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.classList.add('item-card');
            itemCard.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Categoría: ${item.category}</p>
                <p>Stock: ${item.stock}</p>
            `;
            itemListComponent.appendChild(itemCard);
        });
    };

    
    renderInventory(inventory);

    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredItems = inventory.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm) ||
            item.id.toLowerCase().includes(searchTerm)
        );
        renderInventory(filteredItems);
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

  
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const insumo = document.getElementById('insumo-select').value;
        const cantidad = document.getElementById('cantidad').value;
        const justificacion = document.getElementById('justificacion').value;

        if (insumo && cantidad && justificacion) {
            const requestId = `REQ-${Date.now()}`;
            const newRequest = {
                id: requestId,
                type: 'Solicitud',
                insumo: insumo,
                cantidad: parseInt(cantidad),
                justificacion: justificacion,
                date: new Date().toLocaleDateString(),
                status: 'Pendiente' 
            };
            userRequests.push(newRequest);
            localStorage.setItem('userRequests', JSON.stringify(userRequests));

            requestMessage.textContent = '¡Solicitud enviada con éxito! La revisaremos pronto.';
            requestMessage.classList.remove('hidden', 'error-message');
            requestMessage.classList.add('success-message');
            requestForm.reset();
            renderUserRequests(); 
        } else {
            requestMessage.textContent = 'Por favor, completa todos los campos.';
            requestMessage.classList.remove('hidden', 'success-message');
            requestMessage.classList.add('error-message');
        }
    });

    
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const equipoProblema = document.getElementById('equipo-problema').value;
        const descripcionProblema = document.getElementById('descripcion-problema').value;

        if (equipoProblema && descripcionProblema) {
            const reportId = `REP-${Date.now()}`;
            const newReport = {
                id: reportId,
                type: 'Reporte',
                equipo: equipoProblema,
                descripcion: descripcionProblema,
                date: new Date().toLocaleDateString(),
                status: 'Pendiente' 
            };
            userRequests.push(newReport);
            localStorage.setItem('userRequests', JSON.stringify(userRequests));

            reportMessage.textContent = '¡Reporte enviado con éxito! Nuestro equipo lo atenderá.';
            reportMessage.classList.remove('hidden', 'error-message');
            reportMessage.classList.add('success-message');
            reportForm.reset();
            renderUserRequests(); 
        } else {
            reportMessage.textContent = 'Por favor, completa todos los campos.';
            reportMessage.classList.remove('hidden', 'success-message');
            reportMessage.classList.add('error-message');
        }
    });

  
    const renderUserRequests = () => {
        userRequestsList.innerHTML = '';
        if (userRequests.length === 0) {
            userRequestsList.innerHTML = '<p>No tienes solicitudes o reportes activos.</p>';
            return;
        }

        userRequests.forEach(req => {
            const requestItem = document.createElement('div');
            requestItem.classList.add('request-item');
            let content = '';

            if (req.type === 'Solicitud') {
                content = `
                    <h4>Solicitud de ${req.insumo} (${req.cantidad} unidades)</h4>
                    <p>Justificación: ${req.justificacion}</p>
                `;
            } else if (req.type === 'Reporte') {
                content = `
                    <h4>Reporte de Problema con ${req.equipo}</h4>
                    <p>Descripción: ${req.descripcion}</p>
                `;
            }

            requestItem.innerHTML = `
                ${content}
                <p>Fecha: ${req.date}</p>
                <p class="status ${req.status.toLowerCase()}">Estado: ${req.status}</p>
            `;
            userRequestsList.appendChild(requestItem);
        });
    };

   
    renderUserRequests();
});