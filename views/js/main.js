

var objMarkers
$.getJSON("../controllers/paradas.json", function(json){
    
    objMarkers  = json;
});




// var text = '['+
//                 '{'+
//                     '"parada" : "La casa de las chalupas, Santa Julia",'+                
//                     '"coordenadas" : ["20.11290249779656", "-98.7595832089716"]' +
//                 '},'+
//                 '{'+
//                     '"parada" : "Galerías Pachuca, Liverpool",'+  
//                     '"coordenadas" : ["20.09503246845494", "-98.76978663992071"]' +
//                 '}'+
//             ']';

            


const attribution = "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

/** Tipo de mapa donde se va a renderizar */
const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ';

/** var mapa global */
var myMap = L.map('myMap');

/** agregar el tipo de mapa a una ccapa del mapa */
L.tileLayer(tilesProvider, {
    attribution,
    maxZoom: 18,
}).addTo(myMap);

/** impide que se pueda hacer zoom al hacer doble click en el mapa */
myMap.doubleClickZoom.disable(); 

/** var de coordenadas de ubicación actual */
var cordeCurPos = {};

/** marcador de destino */
var markerDestino;

/** marcador de origen */
var markerOrigen;

/** var para agregar la ruta entre destino y origen */
var rutasControl;

var tarifa = 0.0;

var distancia = 0.0;

var tarifaNocturna = 0.0;

const TARIFABASE = 32.50;

const DISTANCIAMIN = 4.0;

/** var para identificar si puede escoger el punto de destino */
var flag = false;

/** var para identificar si ya se pulsó el botón de encontrarme */
var flagFindMe = false;

var flag2Points = false;

var flag2pointsSecond = false;

var flag3rdPoint = false;

var globalOrigen;

var globalDestino;

$(document).on('click', "#tabCurrent", function(event){
    $("#tabContentCurrent").load("pages/tabCurrent.html");
    $( "#cargarResultados" ).empty();
    $("#myMap").hide();
    flag2Points = false;
    flag3rdPoint = false;
    flag2pointsSecond = false;

})

$(document).on('click', "#tabChoosePoints", function(event){
    $("#tabContentChoosePoints").load("pages/tabChoosePoints.html");
    flag2Points = true;
    $( "#cargarResultados" ).empty();
    
    $("#myMap").show();
    myMap.setView([20.101770435692593, -98.75054985574724],14);
    
})

$(document).on('click', "#tabSelectPoints", function(event){
    $("#tabContentSelectPoints").load("pages/tabSelectPoints.html");
    flag2Points = false;
    flag3rdPoint = false;
    flag2pointsSecond = false;
    $( "#cargarResultados" ).empty();
    
    $("#myMap").hide();
    
    
})

$(document).on('click', ".tabsNav", function(event){
    event.preventDefault();
    //$("#myMap").hide();
    // myMap.eachLayer((layer) => {
    //     layer.remove();
    // });
    markerOrigen.remove();
    markerDestino.remove();
    myMap.removeControl(rutasControl);
    
    L.tileLayer(tilesProvider, {
        maxZoom: 18,
    }).addTo(myMap);
    myMap.invalidateSize();
    flag = false;
    flagFindMe = false;    
    
   
})

$(document).on('click', "#btnFindMe", function(event){
    event.preventDefault();   
    
    
    if(navigator.geolocation){ 
        //intentamos obtener las coordenadas del usuario
        navigator.geolocation.getCurrentPosition(            

            (pos) => {
                const {coords} = pos;
                /** igualacion de la var cordeCurPos con la ubicación actual */
                cordeCurPos = coords;
                
                let ubicacionActual = [coords.latitude, coords.longitude];
                /** mostrar el div del mapa */
                $("#myMap").show();

                /** que se renderize al cambiar de tamaño */
                myMap.invalidateSize();

                /** añadir marcador */
                markerOrigen = L.marker(ubicacionActual);

                /** añadir a una capa el marcador */
                myMap.addLayer(markerOrigen); 

                /** mostrar el mapa */
                myMap.setView(ubicacionActual,17);

                /** informar al usuario si es su ubicación */
                Swal.fire('Si no es su ubicación, por favor revise su conexión a internet y vuelva a presionar el botón de "encontrarme".', '', 'info');
                // let avisoEncontrarme = "<p>Haga doble click en el destino que quiera.</p>";
                // let btnListaEncontrarme = "<button id='' type='button' class='btn btn-primary btn-block mt-3'>Seleccionar de una lista de lugares</button>";
                let avisoConfirmar = "<p class='mt-3 bloqueCurrentLocation'>Confirme su ubicación.</p>";
                let btnConfirmar = "<button id='confirmarCurrentLocation' type='button' class='btn btn-success mt-3 bloqueCurrentLocation'>Confirmar ubicación</button>";
                if(flagFindMe == false){
                    $("#tabContentCurrent").append(avisoConfirmar + btnConfirmar); 
                    flagFindMe = true;        
                }             
            },
            (err) => {
                console.log(err);
            }, 
            {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 0
            }
            

        )
    }else{
        //el navegador del usuario no soporta el API de Geolocalizacion de HTML5
        errorjs.innerHTML='Tu navegador no soporta la Geolocalización en HTML5';
    }
   

})

$(document).on('click', "#confirmarCurrentLocation", function(event){
    event.preventDefault();
    $(".bloqueCurrentLocation").remove();
    let avisoEncontrarme = "<p>Haga doble click en el destino que quiera o seleccione un destino en la lista de abajo.</p><div id='divListaCurrent'></div>";
    $.when($("#tabContentCurrent").append(avisoEncontrarme ))
    .done(function( x ) {
        $("#divListaCurrent").load("pages/listaCurrent.html");
        
    });   
    
})

$(document).on('click', "#btnConfirm1stPoint", function(event){
    flag2pointsSecond = true;
})




myMap.on('dblclick', function(e){
    if(flag2Points == true){
        if(flag2pointsSecond == false){
            origen = e.latlng;
            markerOrigen = L.marker(origen);
            myMap.addLayer(markerOrigen);
            //flag2pointsSecond = true;
        }else{
            if(flag3rdPoint == true){
                alert("ño");
            }else{
                destino = e.latlng;        
                markerDestino = L.marker(destino);
                myMap.addLayer(markerDestino);
                flag3rdPoint = true;
                if (window.confirm("Está seguro?")){
                    myMap.fitBounds([
                        origen,
                        destino
                    ]);
                    rutasControl = L.Routing.control ({
                        waypoints: [
                            
                        L.latLng (origen),
                        L.latLng (destino) 
                        ],
                        routeWhileDrawing: true,
                        show:true
                        
                    });
                    rutasControl.addTo(myMap);
                    $("#cargarResultados").load("pages/resultados.html");
                    rutasControl.on('routesfound', function(e) {
                        var routes = e.routes;
                        var summary = routes[0].summary;
                        // alert time and distance in km and minutes
                        distancia = summary.totalDistance/1000;
            
                        redondearDistancia(distancia);
                        getTarifa(distancia);
                        $("#resultDistancia").html(distancia);
                        $("#resultTarifa").html(tarifa);
                        $("#resultTarifaNocturna").html(tarifaNocturna);
                        
                    });
                    
                    
                }else{
                   
                }
            }
            
        }
        

    }else{
        if(flag == false){
            destino = e.latlng;
        
            markerDestino = L.marker(destino);
            myMap.addLayer(markerDestino);
            if (window.confirm("Está seguro?")){
                let ubicacionActual = [cordeCurPos.latitude, cordeCurPos.longitude];
                rutasControl = L.Routing.control ({
                    waypoints: [
                        
                    L.latLng (destino),
                    L.latLng (ubicacionActual) 
                    ],
                    routeWhileDrawing: true,
                    show:true
                    
                });
                rutasControl.addTo(myMap);
                console.log(rutasControl);
                rutasControl.on('routesfound', function(e) {
                    var routes = e.routes;
                    var summary = routes[0].summary;
                    // alert time and distance in km and minutes
                    console.log("Distancia: "+ summary.totalDistance / 1000 );
                    var distance = myMap.distance(destino ,ubicacionActual);
                    console.log("Distancia recta: "+ distance/1000 );
                    
                });
                flag=true;
                
            }else{
                flag=false;
            }
    
            
        }else{
            alert("ño");
        }
    }

    
    
});
var flagMarkerDestino = false;
$(document).on('click', '#btnSelectLocation', function(event){
    event.preventDefault();
    var lista = document.getElementById("listaCurrent");
    if(lista.value == ""){
        Swal.fire('Seleccione algún destino por favor.', '', 'info');
        
    }else{
        if(flagMarkerDestino == true){
            markerDestino.remove();
            myMap.removeControl(rutasControl);
        }
        var lati = lista.value.split(',')[0];
        var longi = lista.value.split(',')[1];
        var origen = [cordeCurPos.latitude, cordeCurPos.longitude];
        var destino = [lati, longi];
        markerDestino = L.marker(destino);
        myMap.addLayer(markerDestino);
        myMap.fitBounds([
            origen,
            destino
        ]);
        flagMarkerDestino = true;
        rutasControl = L.Routing.control ({
            waypoints: [
                
            L.latLng (origen),
            L.latLng (destino) 
            ],
            routeWhileDrawing: true,
            show:true
            
        });
        rutasControl.addTo(myMap);
        $("#cargarResultados").load("pages/resultados.html");
        rutasControl.on('routesfound', function(e) {
            
            var routes = e.routes;
            var summary = routes[0].summary;
            // alert time and distance in km and minutes
            console.log("Distancia: "+ summary.totalDistance / 1000 );
            distancia = summary.totalDistance/1000;
            
            redondearDistancia(distancia);
            getTarifa(distancia);
            $("#resultDistancia").html(distancia);
            $("#resultTarifa").html(tarifa);
            $("#resultTarifaNocturna").html(tarifaNocturna);
            
        
    
            
            
        });
       
        
        
        
    
        
            
        
        
    }
    


})

$(document).on("change", "#listaPoint1", function(){
    
    if(markerOrigen != undefined){
        markerOrigen.remove();
    } 
    $("#myMap").show();
    var lati = this.value.split(',')[0];
    var longi = this.value.split(',')[1];
    globalOrigen = [lati, longi];    
    
    markerOrigen = L.marker(globalOrigen);
    myMap.addLayer(markerOrigen);
    myMap.setView(globalOrigen,17);
})

$(document).on("change", "#listaPoint2", function(){
    $("#btnConfirmSelect2Points").show();
    
    if(markerDestino != undefined){
        markerDestino.remove();
    } 
    
    
    var lati = this.value.split(',')[0];
    var longi = this.value.split(',')[1];
    globalDestino = [lati, longi];    
    
    markerDestino = L.marker(globalDestino);
    myMap.addLayer(markerDestino);
    myMap.setView(globalDestino,17);
})

$(document).on("click", "#btnConfirmSelect2Points", function(){
    myMap.fitBounds([
        globalOrigen,
        globalDestino
    ]);    
    rutasControl = L.Routing.control ({
        waypoints: [
            
        L.latLng (globalOrigen),
        L.latLng (globalDestino) 
        ],
        routeWhileDrawing: true,
        show:true
        
    });
    rutasControl.addTo(myMap);
    $("#cargarResultados").load("pages/resultados.html");
    rutasControl.on('routesfound', function(e) {
        
        var routes = e.routes;
        var summary = routes[0].summary;
        // alert time and distance in km and minutes
        console.log("Distancia: "+ summary.totalDistance / 1000 );
        distancia = summary.totalDistance/1000;
        
        redondearDistancia(distancia);
        getTarifa(distancia);
        $("#resultDistancia").html(distancia);
        $("#resultTarifa").html(tarifa);
        $("#resultTarifaNocturna").html(tarifaNocturna);
    });
})

function redondearDistancia(){
    
    distancia = (Math.round(Math.round(distancia*2)/2 * 100) / 100).toFixed(2);
}

function getTarifa(distance){
    if(distance <= DISTANCIAMIN){
        tarifa = TARIFABASE;  
        tarifaNocturna = parseFloat(Math.round(tarifa*1.2*2)/2);
    }else{
        distanciaExtra = distance-DISTANCIAMIN;
        tarifaExtra = distanciaExtra * 3.0;        
        tarifa = tarifaExtra + TARIFABASE; 
        tarifa = (Math.round(tarifa * 100) / 100).toFixed(2);
        tarifaNocturna = Math.round(tarifa*1.2*2)/2;
        tarifaNocturna = (Math.round(tarifaNocturna * 100) / 100).toFixed(2);
    }

}



