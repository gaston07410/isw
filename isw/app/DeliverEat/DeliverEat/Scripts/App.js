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
    google.maps.event.addListener(marker, 'dragend', function (evt) {
        document.getElementById('current').innerHTML = '<p>Marcador situado Lat: ' + evt.latLng.lat().toFixed(3) + '  Long: ' + evt.latLng.lng().toFixed(3) + '</p>';
    });

    google.maps.event.addListener(marker, 'dragstart', function (evt) {
        document.getElementById('current').innerHTML = '<p>Moviendo el marcador...</p>';
    });
    map.setCenter(marker.position);
    marker.setMap(map);
  
}


//movimiento del marcador//
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}







var app = angular.module("myApp", []);

app.directive('asCurrency', function (currencyFilter) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            var sanitize = function (s) {
                return s.replace(/[^\d|\-+|\.+]/g, '');
            }

            var convert = function () {
                var plain = sanitize(ctrl.$viewValue);
                ctrl.$setViewValue(currencyFilter(plain));
                ctrl.$render();
            };

            elem.on('blur', convert);

            ctrl.$formatters.push(function (a) {
                return currencyFilter(a);
            });

            ctrl.$parsers.push(function (a) {
                return sanitize(a);
            });
        }
    };
})

app.controller("myCtrl", function ($scope) {

    var date = new Date();
    $scope.monthDate = date.getMonth();
    $scope.yearDate = date.getFullYear();

    $scope.search = '';

    $scope.commerceStreet = '';
    $scope.commerceNumber = '';
    $scope.commerceCity = '';
    $scope.commerceReference = '';

    $scope.homeStreet = '';
    $scope.homeNumber = '';
    $scope.homeCity = '';
    $scope.homeReference = '';

    $scope.price = Math.floor(Math.random() * 500);
    $scope.amountToPay = 0;
    $scope.change = 0;

    $scope.selectedPaymentMethods = '';
    $scope.paymentMethods = [
        { name: "Efectivo" },
        { name: "Tarjeta" }
    ];

    $scope.cities = [
        { name: "Córdoba Capital" },
        { name: "Colonia Caroya" },
        { name: "Jesús María" }
    ];

    $scope.imageURL = '';

    $scope.SelectFile = function (e) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $scope.PreviewImage = e.target.result;
            $scope.$apply();
        };

        reader.readAsDataURL(e.target.files[0]);
    };

    $scope.cardType = '';
    $scope.cardName = '';
    $scope.cardLastname = '';
    $scope.cardExpirationDate = '';
    $scope.cardCvc = '';
    $scope.cardNumber = '';

    $scope.cardsAccepted = [
        { number: 1234123412341234, name: "Lionel", lastname: "Messi", monthExpirationDate: 9, yearExpirationDate: 2020, cvc: 123, type: "visa" },
        { number: 1111111111111111, name: "Paulo", lastname: "Dybala", monthExpirationDate: 9, yearExpirationDate: 2020, cvc: 999, type: "visa" }
    ];

    $scope.cardsType = [
        { type: "VISA" },
        { type: "MasterCard" }
    ];

    $scope.validatedCard = false;
    $scope.validatePaid = false;

    $scope.saveMap = function () {
        lat = marker.getPosition().lat();
        lng = marker.getPosition().lng();
        var settings = {
            "async": false,
            "crossDomain": true,
            "url": "https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?language=en&location=" + lat + "%252C" + lng,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
                "x-rapidapi-key": "8f841d33e4mshbf9cbdc007175bfp1e0139jsn51ca6697e01a"
            }
        };

        $.ajax(settings).done(function (response) {
            resp = response.results[0];
            $scope.commerceStreet = resp.street;
            $scope.commerceNumber = resp.house;
            $scope.commerceCity = resp.region + ", " + resp.area;
        });
    };

    $scope.validateMethod = function () {
        if ($scope.selectedPaymentMethods === 'Efectivo') $scope.validatedCard = false;
        else $scope.validatePaid = false;
    };

    $scope.validatePay = function () {
        if ($scope.price > $scope.amountToPay) {
            $scope.change = 0;
            $scope.validatePaid = false;
        }
        else {
            $scope.change = $scope.amountToPay - $scope.price;
            $scope.validatePaid = true;
        }
    };

    $scope.validateExpirationDate = function () {
        $scope.CurrentDate = new Date();

        if ($scope.cardExpirationDate.getTime() <= $scope.CurrentDate.getTime()) {
            alert("fecha de vencimiento menor a la fecha de hoy ");
        } else { alert("La fecha de vencimiento es mayor a la fecha de hoy")}
    };


    $scope.validateCorrectCard = function () {
        if ($scope.cardExpirationDate.getMonth() < $scope.monthDate || $scope.cardExpirationDate.getFullYear() < $scope.yearDate) console.log("Ingrese fecha válida.");
        else {
            $scope.cardsAccepted.forEach(function (card) {
                // No es !== porque algunos son strings y otros son number
                if (card.number == $scope.cardNumber) {
                    // TODO: agregar mensaje de error cuando no es tarjeta VISA
                    if (card.type.toLowerCase() !== 'visa') console.log("Solo se permite tarjetas VISA");
                    if (card.type.toLowerCase() != $scope.cardType.toLowerCase() ||
                        card.name.toLowerCase() != $scope.cardName.toLowerCase() ||
                        ($scope.cardExpirationDate.getMonth() !== card.monthExpirationDate && $scope.cardExpirationDate.getFullYear() !== card.yearExpirationDate) ||
                        card.cvc != $scope.cardCvc ||
                        card.lastname.toLowerCase() != $scope.cardLastname.toLowerCase()) $scope.validatedCard = false;
                    else $scope.validatedCard = true;
                }
            });
        }
    };

    $scope.validateOrder = function () {
        // TODO: agregar mensaje de error en cada caso
        if (!$scope.search) console.log('Cargue algo para que el cadete busque');
        else if (!$scope.commerceStreet || !$scope.commerceNumber || !$scope.commerceCity) console.log('Revise los campos del domicilio del comercio');
        else if (!$scope.homeStreet || !$scope.homeNumber || !$scope.homeCity) console.log('Revise los campos del domicilio de entrega');
        else if (!$scope.validatePaid && !$scope.validatedCard) {
            if (!$scope.validatePaid) console.log('Revise el monto ingresado');
            else console.log('Revise los datos de la tarjeta');
        }
        else console.log("Pedido realizado con éxito.");
    };
});