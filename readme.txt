# AutoPrimeZone - Sistema de Gestión de Venta de Autos

AutoPrimeZone es una aplicación web que permite gestionar un catálogo de autos para venta, con funcionalidades para agregar, editar, eliminar y buscar vehículos.

## Tecnologías Utilizadas

- **Backend**: FastAPI (Python)
- **Frontend**: HTML, CSS y JavaScript (Vanilla)
- **Iconos**: Font Awesome

## Requisitos Previos

- Python 3.8 o superior
- Navegador web moderno

## Instalación

1. Clona el repositorio:
   ```
   git clone https://github.com/tu-usuario/autoprimezone.git
   cd autoprimezone
   ```

2. Crea un entorno virtual:
   ```
   python -m venv venv
   ```

3. Activa el entorno virtual:
   - En Windows:
     ```
     venv\Scripts\activate
     ```
   - En macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Instala las dependencias:
   ```
   pip install -r requirements.txt
   ```

## Ejecutar la Aplicación

1. Inicia el servidor:
   ```
   uvicorn main:app --reload
   ```

2. Abre el navegador y visita:
   ```
   http://localhost:8000
   ```

## Características

- **Catálogo de Autos**: Visualización de autos en formato de tarjetas.
- **Gestión de Autos**: Agregar, editar y eliminar autos.
- **Búsqueda Avanzada**: Filtrar autos por modelo, año y rango de precios.
- **Interfaz Responsiva**: Diseñada para funcionar en dispositivos móviles y de escritorio.
- **Validación de Datos**: Validación tanto en el cliente como en el servidor.
- **Notificaciones**: Sistema de notificaciones para informar al usuario sobre el resultado de sus acciones.

## API Endpoints

- `GET /api/cars`: Obtener todos los autos.
- `GET /api/cars/{car_id}`: Obtener un auto por ID.
- `GET /api/cars/search/`: Buscar autos con filtros (modelo, año, precio).
- `POST /api/cars`: Crear un nuevo auto.
- `PUT /api/cars/{car_id}`: Actualizar un auto existente.
- `DELETE /api/cars/{car_id}`: Eliminar un auto.

## Estructura del Proyecto

- `main.py`: Servidor FastAPI y definición de endpoints.
- `index.html`: Página principal de la aplicación.
- `static/`: Archivos estáticos.
  - `app.js`: Lógica de cliente y comunicación con la API.
  - `styles.css`: Estilos CSS.
- `requirements.txt`: Dependencias del proyecto.

## Próximas Funcionalidades

- Autenticación de usuarios
- Panel de administración
- Imágenes para cada auto
- Estadísticas de ventas
- Integración con sistemas de pago

## Colaboradores

- [Tu Nombre](https://github.com/tu-usuario)

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.