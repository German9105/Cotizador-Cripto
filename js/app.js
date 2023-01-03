const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda ={
    moneda:"",
    criptomoneda:""
}

//Crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
        resolve(criptomonedas);
})

document.addEventListener("DOMContentLoaded", () => {

    consultarCriptomonedas()
    formulario.addEventListener("submit",submitFormulario);
    criptomonedasSelect.addEventListener("change",leerValor);
    monedaSelect.addEventListener("change",leerValor);
})

function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}


function selectCriptomonedas (criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo;
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario (e){
    e.preventDefault();

    //Validar
    const{moneda,criptomoneda} = objBusqueda;

    if(moneda === "" || criptomoneda ===""){
        mostrarAlerta("Todos los campos son obligatorios");
        return;
    }

    // Consultar la API con los resultados
    consultarAPI()
}

function mostrarAlerta(mensaje){

    const existeError = document.querySelector(".error");

    if(!existeError){
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove()
        }, 2000);
    }
   
}

function consultarAPI (){
    const { moneda,criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => mostrarCotizacionHTML(cotizacion.DISPLAY [criptomoneda] [moneda]));
};

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML ();
    const{PRICE,HIGHDAY,LOWDAY,OPENDAY,LASTMARKET} = cotizacion

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `Precio actual: <span> ${PRICE} </span>`;

    const precioApertura = document.createElement("p");
    precioApertura.innerHTML = `Precio de apertura: <span> ${OPENDAY} </span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `Precio mas bajo del día: <span> ${LOWDAY} </span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `El Precio mas alto del día: <span> ${HIGHDAY} </span>`;

    const informacion = document.createElement("p");
    informacion.innerHTML = `Datos de: <span> ${LASTMARKET} </span>`;

    const comprar = document.createElement("p");
    comprar.innerHTML = `<span> ¿Deseas adquirir una criptomoneda? </span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioApertura);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(informacion);
    resultado.appendChild(comprar);
    
}

function limpiarHTML (){
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}