var marker;
//Funcionalidad para el mapa//

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: -31.4199055, lng: -64.1887394 }
    });
// insertar marcador//
    marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: -31.4208233, lng: -64.1887394 }
    });
    marker.addListener('click', toggleBounce);
}
//movimiento del marcador//
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}