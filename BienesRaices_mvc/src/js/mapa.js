(function() {
    const lat = document.getElementById('latitud').value || -34.603722;
    const lng = document.getElementById('longitud').value || -58.3827959;
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    let marker;
    
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marker = new L.marker([lat, lng], { draggable: true, autoPan: true }).addTo(mapa);

    marker.on('moveend', function(e) {
        marker = e.target;
        const position = marker.getLatLng();
        mapa.panTo(new L.LatLng(position.lat, position.lng));

        geocodeService.reverse().latlng(position, 12).run(function(error, result) {
            if (error) {
                return;
            }
            marker.bindPopup(result.address.LongLabel);

            // Actualizar los inputs ocultos
            document.getElementById('direccion').value = result.address.LongLabel;
            document.getElementById('latitud').value = position.lat;
            document.getElementById('longitud').value = position.lng;
            
            // Actualizar el texto visible con la dirección
            document.getElementById('direccion-seleccionada').textContent = result.address.LongLabel;
        });
    });

})()