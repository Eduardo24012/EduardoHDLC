let latitud;
let longitud;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            latitud = position.coords.latitude;
            longitud = position.coords.longitude;

            //mostrar mapa    
            const Ubicacion = [20.824276, -98.289419];
            const mapa = L.map('map').setView(Ubicacion, 17);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapa);

            //marcador de la ubicacion del poligo de mi casa
            
            var poligono = L.polygon([
                [20.824231, -98.289566],
                [20.824252, -98.289306],
                [20.824366, -98.289333]
            ]).addTo(mapa);

            let marcador = L.marker(Ubicacion).addTo(mapa);
            poligono.bindPopup('Mi casa esta Ubicado en Pesmayo Xochiatipan.mis coordenadas son : '+latitud+' , Longitud : '+longitud+
                '<br><br><a href="https://www.youtube.com/watch?v=39HjacZYxCo" target="_blank">Más información Pesmayo</a>')
            .openPopup();
        },
        (error) => {
            alert("¡Error! al obtener la geolocalizacion." + error.message);
        }
    );
} else {
    alert("¡Error! la geolocalizacion no es soportado por este navegador.");
}