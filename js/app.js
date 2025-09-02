let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas', 
    3: 'Postres'
};

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo === '');
    if(camposVacios){

        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent= 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() =>{
                alerta.remove();
            }, 3000);
        }
        return;
    }

    //Asignar datos del formulario a cliente
    cliente = {...cliente, mesa, hora};

    //Ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar las secciones
    mostrarSecciones();

    //Obtener platillos de la API de JSON-Server
    obtenerPlatillos(); 
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarPlatos(resultado))
        .catch(error => console.log(error));
}

function mostrarPlatos(platos){

    const contenido = document.querySelector('#platillos .contenido');

    platos.forEach( plato => {

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = plato.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${plato.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[plato.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${plato.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el plato que se esta agregando
        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPLato({...plato, cantidad});
        };

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    })
}

function agregarPLato(plato){
    //Extraer pedido actual
    let {pedido} = cliente;
    //Revisar que la cantidad sea mayor a cero
    if (plato.cantidad > 0){ 

        //Si el plato ya existe en pedido
        if(pedido.some( platoRegistrado => platoRegistrado.id === plato.id)){
            //Actualizamos la cantidad
            const pedidoActualizado = pedido.map(platoRegistrado => {
                if(platoRegistrado.id === plato.id){
                    platoRegistrado.cantidad = plato.cantidad;
                }
                return platoRegistrado;
            });

            //Se asigna el nuevo array a cliente.pedido
            cliente.pedido= [...pedidoActualizado];
        } 
        else {
        //Si el plato no existe en pedido se agrega
        cliente.pedido = [...pedido, plato];
        }
    }
    else{
        //Eliminamos el plato del pedido cuando la cantidad sea 0
        const pedidoModificado = pedido.filter( platoRegistrado => platoRegistrado.id !== plato.id );
        cliente.pedido = [...pedidoModificado];
    }

    //Limpiamos el HTML
    const contenido= document.querySelector('#resumen .contenido');
    limpiarHTML(contenido);

    //Si hay algo en el pedido
    if(cliente.pedido.length){
        //Mostrar resumen
        actualizarResumen();
    }
    else{
        //Si el pedido esta vacio
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    const contenido= document.querySelector('#resumen .contenido');
    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //Informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa:';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora:';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar los elementos al padre
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de seccion
    const heading = document.createElement('H3');
    heading.textContent= 'Platos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(plato => {
        const {nombre, cantidad, precio, id} = plato;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        //Nombre del plato
        const nombrePlato = document.createElement('H4');
        nombrePlato.classList.add('my-4');
        nombrePlato.textContent = nombre;

        //Cantidad del plato
        const cantidadPlato = document.createElement('P');
        cantidadPlato.classList.add('fw-bold');
        cantidadPlato.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio del plato
        const precioPlato = document.createElement('P');
        precioPlato.classList.add('fw-bold');
        precioPlato.textContent = 'Precio: ';

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        //Subtotal del plato
        const subtotal = document.createElement('P');
        subtotal.classList.add('fw-bold');
        subtotal.textContent = 'Precio: ';

        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        //Agrefar boton eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent='Eliminar del Pedido';

        //Funcion para eliminar del pedido
        btnEliminar.onclick = function (){
            eliminarProducto(id);
        };
        

        //Agregar valores a sus contenedores
        cantidadPlato.appendChild(cantidadValor);
        precioPlato.appendChild(precioValor);
        subtotal.appendChild(subtotalValor)

        //Agregar elementos al LI
        lista.appendChild(nombrePlato);
        lista.appendChild(cantidadPlato);
        lista.appendChild(precioPlato);
        lista.appendChild(subtotal);
        lista.appendChild(btnEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista);

    })

    //Agregar al contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar formulario de propinas
    formularioPropinas();
}

//Eliminamos el producto desde el id
function eliminarProducto(id){
    const {pedido} = cliente;
    const pedidoModificado = pedido.filter( platoRegistrado => platoRegistrado.id !== id );
    cliente.pedido = [...pedidoModificado];

    //Limpiamos HTML
    const contenido= document.querySelector('#resumen .contenido');
    limpiarHTML(contenido);

    if(cliente.pedido.length){
        //Mostrar resumen
        actualizarResumen();
    }
    else{
        //Si el pedido esta vacio
        mensajePedidoVacio();
    }

    //El producto se elimino entonces la cantidad en el formulario va a ser 0
    const productoEliminado = `#producto-${id}`;
    const inputElementoEliminado= document.querySelector(productoEliminado);
    inputElementoEliminado.value = 0;
}

function limpiarHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}

function calcularSubtotal(precio, cantidad){
    return `$${precio * cantidad}`;
}

function mensajePedidoVacio(){
    const contenido= document.querySelector('#resumen .contenido');
     const texto = document.createElement('P');
     texto.classList.add('text-center');
     texto.textContent = 'Añade los elementos del pedido';

     contenido.appendChild(texto);
}

function formularioPropinas(){
    const contenido= document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario', 'card', 'py-2', 'px-3', 'shadow');

    //Para que los platos consumidos y propina tengan espacio entre si
    const formularioDiv = document.createElement('DIV');
    formulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio button para las propinas
    //10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent= '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25";
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent= '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    //50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50";
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent= '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);

    //Agregar al Div principal
    formularioDiv.appendChild(heading);
    formularioDiv.appendChild(radio10Div);
    formularioDiv.appendChild(radio25Div);
    formularioDiv.appendChild(radio50Div);

    //Agregar al formulario
    formulario.appendChild(formularioDiv);

    contenido.appendChild(formulario);
}

function calcularPropina(){

    const {pedido} = cliente;
    let subtotal = 0;

    //Calcular subtotal a pagar
    pedido.forEach( plato => {
        subtotal += plato.precio * plato.cantidad;
    });

    //Seleccionar radio button
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //Calcular propina
    const propina = ((subtotal * parseInt(propinaSeleccionada))/100);
 
    //Calcular el total a pagar
    const total = subtotal + propina;
    
    mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina){

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');

    //Subtotal
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //Propina

    const propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total
    const totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);

    //Limpiamos HTML
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    //Agregamos todos los parrafos al div
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}