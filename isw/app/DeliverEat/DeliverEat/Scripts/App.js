var marker;
//Funcionalidad para el mapa//

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: -31.4199055, lng: -64.1887394 },
        gestureHandling: "greedy"
       
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
});

app.controller("myCtrl", function ($scope) {

    $scope.CurrentDate = new Date();
    var date = new Date();
    $scope.monthDate = date.getMonth();
    $scope.yearDate = date.getFullYear();

    $scope.search = '';

    $scope.invalidDate = false;
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

    $scope.dateDelivery = '';
    $scope.dateOfDelivery = '';
    $scope.deliveries = [
        { value: 'Lo antes posible' },
        { value: 'Otro' }
    ];

    $scope.selectedPaymentMethods = '';
    $scope.paymentMethods = [
        { name: "Efectivo" },
        { name: "Tarjeta" }
    ];

    $scope.cities = [
        { name: "Córdoba Capital" },
        { name: "Villa Allende" },
        { name: "Río Ceballos" }
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
        { number: 4234123412341234, name: "Lionel", lastname: "Messi", monthExpirationDate: 9, yearExpirationDate: 2020, cvc: 123, type: "visa" }
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
            $scope.commerceNumber = parseInt(resp.house);
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

    $scope.validateDate = function () {
        if ($scope.dateDelivery < $scope.CurrentDate) {
            toastr.error("La fecha ingresada es anterior al día de hoy");
            $scope.invalidDate = true;
        } else $scope.invalidDate = false;
    };


    $scope.validateCorrectCard = function () {
        if ($scope.cardType.toLowerCase() !== 'visa') toastr.error('Solo se aceptan tarjetas VISA.');
        else if (!$scope.cardExpirationDate || ($scope.cardExpirationDate.getMonth() < $scope.monthDate || $scope.cardExpirationDate.getFullYear() < $scope.yearDate)) toastr.error("Ingrese fecha válida.");
        else if (!$scope.cardType || !$scope.cardName || !$scope.cardLastname || !$scope.cardNumber || !$scope.cardExpirationDate || !$scope.cardCvc) toastr.error("Complete todos los datos de la tarjeta.");
        else {
            $scope.cardsAccepted.forEach(function (card) {
                if (card.number != $scope.cardNumber ||
                    card.type.toLowerCase() != $scope.cardType.toLowerCase() ||
                    card.name.toLowerCase() != $scope.cardName.toLowerCase() ||
                    ($scope.cardExpirationDate.getMonth() !== card.monthExpirationDate && $scope.cardExpirationDate.getFullYear() !== card.yearExpirationDate) ||
                    card.cvc != $scope.cardCvc ||
                    card.lastname.toLowerCase() != $scope.cardLastname.toLowerCase()) {
                    if (isNaN($scope.cardNumber) || $scope.cardNumber.length != 16) toastr.error('El número de la tarjeta debe ser un número.');
                    else if (isNaN($scope.cardCvc) || $scope.cardCvc.length != 3) toastr.error('El CVC debe tener 3 dígitos y debe ser un número.');
                    else toastr.error('Ingrese tarjeta válida');
                    $scope.validatedCard = false;
                }
                else {
                    $scope.validatedCard = true;
                    toastr.success("Tarjeta válida");
                }
            });
        }
    };

    $scope.validateOrder = function () {

        if (!$scope.search) toastr.error('Complete el campo con lo que el cadete debe buscar');
        else if (!$scope.commerceStreet || !$scope.commerceNumber || $scope.commerceNumber < 0 || !$scope.commerceCity) toastr.error('Revise los campos del domicilio del comercio');
        else if (!$scope.homeStreet || !$scope.homeNumber || !$scope.homeCity || $scope.homeNumber < 0) toastr.error('Revise los campos del domicilio de entrega');
        else if (!$scope.dateOfDelivery || ($scope.dateOfDelivery === 'Otro' && !$scope.dateDelivery) || $scope.invalidDate) toastr.error('Revise los campos de la fecha de entrega');
        else if (!$scope.validatePaid && !$scope.validatedCard) {
            if (!$scope.validatePaid) toastr.error('Revise el monto ingresado');
            else toastr.error('Revise los datos de la tarjeta');
        }
        else {
            if ($scope.dateOfDelivery === 'Lo antes posible') toastr.success("El pedido fue enviado, el cadete le entregará su producto lo antes posible");
            else toastr.success("El pedido fue enviado, el cadete le entregará su producto en la fecha seleccionada");
        }
    };
});