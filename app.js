document.addEventListener('DOMContentLoaded', () => {
    // Cache de elementos DOM
    const carGrid = document.getElementById('cars');
    const addCarForm = document.getElementById('addCarForm');
    const editCarForm = document.getElementById('editCarForm');
    const searchCarForm = document.getElementById('searchCarForm');
    const clearSearchBtn = document.getElementById('clearSearch');
    const editModal = document.getElementById('editModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModalBtn = document.querySelector('.close');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    // Variable para almacenar el ID del auto a eliminar
    let carToDeleteId = null;

    // API URL base
    const API_URL = 'http://localhost:8000/api';

    // Funciones para interactuar con la API
    async function fetchCars(searchParams = '') {
        try {
            const response = await fetch(`${API_URL}/cars${searchParams}`);
            if (!response.ok) {
                throw new Error('Error al cargar los autos');
            }
            const cars = await response.json();
            renderCars(cars);
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }

    async function fetchCarById(id) {
        try {
            const response = await fetch(`${API_URL}/cars/${id}`);
            if (!response.ok) {
                throw new Error('Auto no encontrado');
            }
            return await response.json();
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function createCar(carData) {
        try {
            const response = await fetch(`${API_URL}/cars`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al crear el auto');
            }
            
            const newCar = await response.json();
            showNotification('Auto agregado con éxito', 'success');
            return newCar;
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function updateCar(id, carData) {
        try {
            const response = await fetch(`${API_URL}/cars/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al actualizar el auto');
            }
            
            const updatedCar = await response.json();
            showNotification('Auto actualizado con éxito', 'success');
            return updatedCar;
        } catch (error) {
            showNotification(error.message, 'error');
            return null;
        }
    }

    async function deleteCar(id) {
        try {
            const response = await fetch(`${API_URL}/cars/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al eliminar el auto');
            }
            
            showNotification('Auto eliminado con éxito', 'success');
            return true;
        } catch (error) {
            showNotification(error.message, 'error');
            return false;
        }
    }

    // Función para renderizar los autos
    function renderCars(cars) {
        carGrid.innerHTML = '';
        
        if (cars.length === 0) {
            carGrid.innerHTML = '<div class="no-results">No se encontraron autos</div>';
            return;
        }
        
        cars.forEach(car => {
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.innerHTML = `
                <div class="car-image">
                    <i class="fas fa-car"></i>
                </div>
                <div class="car-details">
                    <h3 class="car-title">${car.title} ${car.model}</h3>
                    <div class="car-info">
                        <p><i class="fas fa-calendar"></i> Año: ${car.year}</p>
                        <p><i class="fas fa-tag"></i> ID: ${car.id}</p>
                    </div>
                    <div class="car-price">$${car.price.toLocaleString()}</div>
                    <div class="car-actions">
                        <button class="btn btn-warning edit-car" data-id="${car.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger delete-car" data-id="${car.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
            carGrid.appendChild(carCard);
        });
        
        // Agregar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.edit-car').forEach(button => {
            button.addEventListener('click', () => openEditModal(button.dataset.id));
        });
        
        document.querySelectorAll('.delete-car').forEach(button => {
            button.addEventListener('click', () => openDeleteModal(button.dataset.id));
        });
    }

    // Funciones para manejar modales
    async function openEditModal(id) {
        const car = await fetchCarById(id);
        if (car) {
            document.getElementById('editId').value = car.id;
            document.getElementById('editTitle').value = car.title;
            document.getElementById('editModel').value = car.model;
            document.getElementById('editYear').value = car.year;
            document.getElementById('editPrice').value = car.price;
            
            editModal.style.display = 'flex';
        }
    }

    function closeEditModal() {
        editModal.style.display = 'none';
        editCarForm.reset();
    }

    function openDeleteModal(id) {
        carToDeleteId = id;
        deleteModal.style.display = 'flex';
    }

    function closeDeleteModal() {
        deleteModal.style.display = 'none';
        carToDeleteId = null;
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación con animación
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Ocultar y eliminar notificación después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Event Listeners
    // Formulario para agregar un auto
    addCarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const carData = {
            id: parseInt(document.getElementById('id').value),
            title: document.getElementById('title').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            price: parseInt(document.getElementById('price').value)
        };
        
        const newCar = await createCar(carData);
        if (newCar) {
            addCarForm.reset();
            fetchCars();
        }
    });

    // Formulario para editar un auto
    editCarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = parseInt(document.getElementById('editId').value);
        const carData = {
            title: document.getElementById('editTitle').value,
            model: document.getElementById('editModel').value,
            year: parseInt(document.getElementById('editYear').value),
            price: parseInt(document.getElementById('editPrice').value)
        };
        
        const updatedCar = await updateCar(id, carData);
        if (updatedCar) {
            closeEditModal();
            fetchCars();
        }
    });

    // Formulario para buscar autos
    searchCarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const model = document.getElementById('searchModel').value;
        const year = document.getElementById('searchYear').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        let searchParams = '/search/?';
        if (model) searchParams += `model=${model}&`;
        if (year) searchParams += `year=${year}&`;
        if (minPrice) searchParams += `min_price=${minPrice}&`;
        if (maxPrice) searchParams += `max_price=${maxPrice}&`;
        
        // Eliminar el último caracter si es un &
        if (searchParams.endsWith('&')) {
            searchParams = searchParams.slice(0, -1);
        }
        
        // Si solo tenemos /search/?, entonces no hay parámetros
        if (searchParams === '/search/?') {
            searchParams = '';
        }
        
        fetchCars(searchParams);
    });

    // Botón para limpiar búsqueda
    clearSearchBtn.addEventListener('click', () => {
        document.getElementById('searchModel').value = '';
        document.getElementById('searchYear').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        fetchCars();
    });

    // Manejo de modales
    closeModalBtn.addEventListener('click', closeEditModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (carToDeleteId) {
            const success = await deleteCar(carToDeleteId);
            if (success) {
                closeDeleteModal();
                fetchCars();
            }
        }
    });
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Cerrar modales si se hace clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
        if (e.target === deleteModal) {
            closeDeleteModal();
        }
    });

    // Agregar estilos para notificaciones
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(120%);
            transition: transform 0.3s ease;
        }
        .notification.show {
            transform: translateX(0);
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification.success {
            border-left: 4px solid #28a745;
        }
        .notification.error {
            border-left: 4px solid #dc3545;
        }
        .notification.info {
            border-left: 4px solid #007bff;
        }
        .notification i {
            font-size: 1.2rem;
        }
        .notification.success i {
            color: #28a745;
        }
        .notification.error i {
            color: #dc3545;
        }
        .notification.info i {
            color: #007bff;
        }
        .no-results {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #6c757d;
            grid-column: 1 / -1;
        }
    `;
    document.head.appendChild(style);

    // Cargar los autos al iniciar la página
    fetchCars();
});