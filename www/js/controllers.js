angular.module('App.controllers', [])
    .controller('MainCtrl', ['$scope',
        function($scope) {

        }
    ])
    .controller('OnePlayerCtrl', ['$scope', '$timeout',
        function($scope, $timeout) {
            var score = 0,
                playerChoose, comChoose, items = {
                    BUA: {
                        id: 0,
                        src: 'bua_500x500.png'
                    },
                    KEO: {
                        id: 1,
                        src: 'keo_500x500.png'
                    },
                    BAO: {
                        id: 2,
                        src: 'bao_500x500.png'
                    }
                }, canPlay = true;
            $scope.chooseItem = function(id) {
                if (canPlay) {
                    playerChoose = getItem(id >= 3 ? (Date.now()) % 3 : id);
                    $timeout(function() {
                        comChoose = getItem(Date.now() % 3);
                        showChoose();
                        checkWin();
                        canPlay = false;
                    }, 100);

                }

            };

            function getItem(id) {
                for (var item in items) {
                    if (items[item].id == id) {
                        return items[item];
                    }
                }
            };

            function checkWin() {

            };

            function hideChoose() {
                angular.element(document.getElementById('result')).html('');
                canPlay = true;
            }

            function showChoose() {
                angular.element(document.getElementById('result')).append('<img src="img/' + playerChoose.src + '" class="result-player1">');
                angular.element(document.getElementById('result')).append('<img src="img/' + comChoose.src + '" class="result-player2">');
                $timeout(hideChoose, 3000);
            };

        }
    ])
    .controller('TwoPlayerCtrl', ['$scope',
        function($scope) {

        }
    ]);
