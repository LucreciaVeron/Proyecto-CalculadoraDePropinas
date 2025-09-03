# 🍽️ Restaurante - Gestor de Pedidos

Aplicación web en **JavaScript puro** que permite gestionar pedidos en un restaurante.  
Los clientes ingresan su **número de mesa** y **hora**, seleccionan platos de un menú dinámico obtenido desde un **JSON-Server**, y el sistema calcula automáticamente el consumo, propinas y el total a pagar.

Este proyecto fue creado como parte del curso de Udemy:  
[JavaScript Moderno: Guía Definitiva Construye +10 Proyectos](https://www.udemy.com/course/javascript-moderno-guia-definitiva-construye-10-proyectos)

---

## 🚀 Características

- Registro de **mesa** y **hora** mediante un formulario modal.
- Consulta dinámica de **platos** desde una API local (JSON-Server).
- Interfaz para seleccionar cantidad de cada plato (comida, bebidas y postres).
- Cálculo automático de:
  - Subtotal
  - Propina (10%, 25% o 50%)
  - Total a pagar
- Resumen en tiempo real del pedido con opción de **eliminar platos**.
- Validación de campos con mensajes de error.

---

## 🛠️ Tecnologías utilizadas

- **JavaScript (ES6+)**
- **Bootstrap 5**
- **Fetch API**
- **JSON-Server**
- **HTML5 + CSS3**

---

## ▶️ Cómo usar

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/LucreciaVeron/Proyecto-CalculadoraDePropinas.git
   ```

2. Ingresar a la carpeta del proyecto:
   ```bash
   cd Restaurante-Pedidos
   ```

3. Instalar JSON-Server (si no lo tenés instalado):
  ```bash
  npm install -g json-server
  ```

4. Iniciar el servidor de la API con el archivo db.json incluido:
  ```bash
  json-server --watch db.json --port 4000
  ```
