from fastapi import FastAPI, Body, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

# Modelo Pydantic para validación de datos
class Car(BaseModel):
    id: int
    title: str
    model: str
    year: int
    price: int

class CarUpdate(BaseModel):
    title: str
    model: str
    year: int
    price: int

app = FastAPI(
    title="AutoPrimeZone API",
    description="API para gestión de venta de autos de lujo",
    version="3.0.1"
)

# Configurar CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar orígenes exactos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar la carpeta "static" para servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Datos de ejemplo - en una aplicación real usarías una base de datos
cars = [
    {
        "id": 1,
        "title": "Ford",
        "model": "Mustang GT",
        "year": 2022,
        "price": 45000
    },
    {
        "id": 2,
        "title": "Chevrolet",
        "model": "Camaro SS",
        "year": 2021,
        "price": 42000
    },
    {
        "id": 3,
        "title": "Dodge",
        "model": "Challenger SRT",
        "year": 2023,
        "price": 55000
    }
]

# Ruta para servir el archivo index.html
@app.get("/", tags=['Home'])
def home():
    return FileResponse('templates/index.html')

# API Endpoints
@app.get("/api/cars", tags=['cars'], response_model=List[Car])
def get_all_cars():
    return cars

@app.get("/api/cars/{car_id}", tags=['cars'], response_model=Car)
def get_car_by_id(car_id: int):
    for car in cars:
        if car["id"] == car_id:
            return car
    raise HTTPException(status_code=404, detail="Auto no encontrado")

@app.get("/api/cars/search/", tags=['cars'])
def search_cars(model: Optional[str] = None, year: Optional[int] = None, min_price: Optional[int] = None, max_price: Optional[int] = None):
    results = cars.copy()
    
    if model:
        results = [car for car in results if model.lower() in car["model"].lower()]
    
    if year:
        results = [car for car in results if car["year"] == year]
    
    if min_price:
        results = [car for car in results if car["price"] >= min_price]
    
    if max_price:
        results = [car for car in results if car["price"] <= max_price]
    
    return results

@app.post("/api/cars", tags=['cars'], response_model=Car)
def create_car(car: Car):
    # Verificar si el ID ya existe
    if any(c["id"] == car.id for c in cars):
        raise HTTPException(status_code=400, detail="ID de auto ya existe")
    
    # Agregar el nuevo auto
    new_car = car.dict()
    cars.append(new_car)
    return new_car

@app.put("/api/cars/{car_id}", tags=['cars'], response_model=Car)
def update_car(car_id: int, car_update: CarUpdate):
    for car in cars:
        if car["id"] == car_id:
            car["title"] = car_update.title
            car["model"] = car_update.model
            car["year"] = car_update.year
            car["price"] = car_update.price
            return car
    raise HTTPException(status_code=404, detail="Auto no encontrado")

@app.delete("/api/cars/{car_id}", tags=['cars'], response_model=Car)
def delete_car(car_id: int):
    for i, car in enumerate(cars):
        if car["id"] == car_id:
            return cars.pop(i)
    raise HTTPException(status_code=404, detail="Auto no encontrado")