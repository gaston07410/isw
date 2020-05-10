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

var app = angular.module("myApp", []);

app.controller("myCtrl", function ($scope) {

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
        // TODO: Cambiar el expirtionDate. Que sea efectivamente una fecha.
        { number: 1234123412341234, name: "Lionel", lastname: "Messi", expirationDate: '09/25', cvc: 123, type: "visa" },
        { number: 1111111111111111, name: "Paulo", lastname: "Dybala", expirationDate: '09/25', cvc: 999, type: "visa" }
    ];

    $scope.cardsType = [
        { type: "VISA" },
        { type: "MasterCard" }
    ];

    $scope.validatedCard = false;
    $scope.validatePaid = false;

    $scope.saveMap = function () {
        console.log("marker", marker);
    };

    $scope.validatePay = function () {
        // TODO: Mostrar un mensaje de error en el caso que el monto ingresado sea menor al monto a pagar.
        if ($scope.price > $scope.amountToPay) $scope.validatePaid = false;
        else {
            $scope.change = $scope.amountToPay - $scope.price;
            $scope.validatePaid = true;
        }
    };

    $scope.validateExpirationDate = function () {
        // TODO: Validar que la fecha ingresada sea superior al día de hoy.
    };

    $scope.validateCorrectCard = function () {
        $scope.cardsAccepted.forEach(function (card) {
            console.log("$scope.cardsAccepted.expirationDate", card.expirationDate);
            console.log("$scope.cardNumber", $scope.cardExpirationDate);
            // TODO: Agregar validación por expiration date
            // No es !== porque algunos son strings y otros son number
            if (card.number == $scope.cardNumber) {
                if (card.number != $scope.cardNumber ||
                    card.type.toLowerCase() != $scope.cardType.toLowerCase() ||
                    card.name.toLowerCase() != $scope.cardName.toLowerCase() ||
                    card.cvc != $scope.cardCvc ||
                    card.lastname.toLowerCase() != $scope.cardLastname.toLowerCase()) console.log("Los datos de la tarjeta son incorrectos");
                else $scope.validatedCard = true;
            } 
        });
    };

    $scope.validateOrder = function () {
        //TODO: Validar que los campos obligatorios estén ingresados
        // Ej: if ($scope.commerceStreet || $scope.commerceNumber ) y demás...
    };
});