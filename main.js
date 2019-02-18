//---------------------------------------------------------------------------------
// Leonardo Andres Ospina Ramirez - Projecto Matematica Basica App del clima
//---------------------------------------------------------------------------------

// Cuando el navegador escucha el evento de carga de la pag se ejecuta
window.addEventListener('load', () => {
    // Obtener los datos de los input
    obtenerCoordenadasInput();

});

function obtenerCoordenadasInput() {
    // Obtener los datos ingresados en los input
    let lonInput = document.getElementById('txtLongitud');
    let latInput = document.getElementById('txtLatitud');
    let btnUbicacion = document.getElementById('btnUbicacion');
    // Declarar variables para almacenar los valores de los input
    let lonValue;
    let latValue;

    /* llamar obtener coordenadas para que al cargar la app muestre 
       los datos por defecto segun las coordenadas del navegador*/
    obtenerCoordenadas();

    // Agregar evento al boton ubicacion
    btnUbicacion.addEventListener('click', (data) => {
        // Validar si los dos inpues estan vacios
        if (lonInput.value.length == 0 || latInput.value.length == 0) {
            console.log('campos vacios');
            return false;
        } else {
            // Capturar el valor ingresado por los input
            lonValue = lonInput.value;
            latValue = latInput.value;
            // Pasar los valores obtenidos a la api para hacer la peticion
            peticionAPI(lonValue, latValue);
            return true;
        }

    });

}

function obtenerCoordenadas() {

    // Crear variables para almacenar las coordenadas
    let longitud;
    let latitud;

    // Verificar si el navegador tiene acceso a las coordenadas
    if (navigator.geolocation) {
        //Obtener las cordenadas del navegador
        navigator.geolocation.getCurrentPosition(posicion => {

            // Almacenar la longitud y latitud
            longitud = posicion.coords.longitude;
            latitud = posicion.coords.latitude;
            // Acer la peticion a la API
            peticionAPI(longitud, latitud);
        });

    } else {
        // Mostramos error si no podemos acceder a la informacion del navegador
        console.log('No se pudo acceder a la informacion de las coordenadas del navegador')
    }

}

function peticionAPI(lon, lat) {
    /* Proxy en heroku para saltar la seguridad de la API que no envia datos al localhost e
       interpolar los datos a la url para la peticion
    */
    const proxy = `https://cors-anywhere.herokuapp.com/`;
    const api = `${proxy}https://api.darksky.net/forecast/c02b1bb46f7d499714a78892a08ed571/${lat},${lon}`;

    // Pedir los datos a la API del clima

    fetch(api)
        .then(respuesta => {
            return respuesta.json(); // Convertir a formato json los datos retornados
        })
        .then(data => {
            // Agregar los datos al DOOM 
            asignarDatosDoom(data)
        })


}

function asignarDatosDoom(data) {
    // Seleccionar los elementos del DOOM
    let ubicacion = document.querySelector('.temperature-location')
    let descripcion = document.querySelector('.temperature-description');
    let temperatura = document.querySelector('.temperature');
    let grados = document.querySelector('.type');
    let valor = 'f°';

    // Asignar los datos del api al html-doom
    let temp = temperatura.textContent = data.currently.temperature;
    ubicacion.textContent = data.timezone;
    descripcion.textContent = data.currently.summary;
    grados.textContent = valor.toUpperCase(); // Convertimos el valor a mayuscula

    // Pasamos la informacion
    asignarEventoClickGrados(grados, temp, temperatura);
}

function asignarEventoClickGrados(grados, temp, temperatura) {
    // Asignamos el evento click al elemento del doom
    grados.addEventListener('click', () => {
        // Verificamos si el dato de entrada del  doom es grados fahrenheit
        if (grados.textContent === 'f°'.toUpperCase()) {
            // Cambiamos el elemento del doom por al letra c en mayuscula
            grados.textContent = 'c°'.toUpperCase();
            // Cambiamos el elemento del doom y convertimos los grados
            temperatura.textContent = convertirGradosFahrenheit(temp);

        } else {
            // cambiamos el valor del doom por fahrenheit
            grados.textContent = 'f°'.toUpperCase();
            // Cambiamos el elemento del doom por el valor d ela API Fahrenheit            
            temperatura.textContent = temp;
        }
    });
}

function convertirGradosFahrenheit(temp) {
    // Formula para convertir grados fahrenheit a centigrados ( °F − 32) × 5/9 =  °C    
    let celcius = ((temp - 32) * 5 / 9).toFixed(1); // Limita el numero de decimales a mostrar  
    // Devolvemos el resultado
    return celcius;
}