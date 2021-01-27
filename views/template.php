

<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <meta name="title" content="Tarifas de taxis">
        

        <title>Tarifas de taxis</title>

        <base href="views/">

        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin=""/>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />

        <link rel="stylesheet" href="css/plugins/bootstrap.min.css">
        <link rel="stylesheet" href="css/plugins/font-awesome-all.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/plugins/jquery-3.5.1.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
        
        
    </head>

    <body>
        
            <div class="container">
                <div class="card card-main">
                    <div class="card-header">
                        <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                            <li class="nav-item text-center">
                                <a class="nav-link tabsNav active" id="tabCurrent" data-toggle="tab" href="#tabContentCurrent" role="tab" aria-controls="home" aria-selected="true">Ubicación actual</a>
                            </li>
                            <li class="nav-item text-center">
                                <a class="nav-link tabsNav" id="tabChoosePoints" data-toggle="tab" href="#tabContentChoosePoints" role="tab" aria-controls="profile" aria-selected="false">Escoger puntos en el mapa</a>
                            </li>
                            <li class="nav-item text-center">
                                <a class="nav-link tabsNav" id="tabSelectPoints" data-toggle="tab" href="#tabContentSelectPoints" role="tab" aria-controls="contact" aria-selected="false">Escoger puntos fijos</a>
                            </li>
                        </ul>                        
                    </div>
                    <div class="card-body" ">      
                        <div class="tab-content mb-3" id="currentLocation">
                            <div class="tab-pane fade show active" id="tabContentCurrent" role="tabpanel" aria-labelledby="tabCurrent">
                                
                            </div>
                            <div class="tab-pane fade" id="tabContentChoosePoints" role="tabpanel" aria-labelledby="tabChoosePoints">2</div>
                            <div class="tab-pane fade" id="tabContentSelectPoints" role="tabpanel" aria-labelledby="tabSelectPoints">3</div>
                        </div>
                        <div id='cargarResultados'></div>
                        <div id="myMap"  style="height: 600px; display:none;">

                        </div>
                    </div>
                </div>
            </div>
        
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>
        <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script> 
        
        <script src="js/plugins/bootstrap.bundle.min.js"></script>
        <script src="js/main.js"></script>

        
    </body>
</html>