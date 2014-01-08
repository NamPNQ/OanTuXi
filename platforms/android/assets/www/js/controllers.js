angular.module('App.controllers', [])
    .controller('MainCtrl', ['$scope',
        function($scope) {

        }
    ])
    .controller('OnePlayerCtrl', ['$scope', '$timeout', 'notification',
        function($scope, $timeout, notification) {
            var score = 0,
                playerChoose, comChoose, items = {
                    BUA: {
                        id: 0,
                        src: 'bua_500x500.png',
                        name: 'BUA'
                    },
                    KEO: {
                        id: 1,
                        src: 'keo_500x500.png',
                        name: 'KEO'
                    },
                    BAO: {
                        id: 2,
                        src: 'bao_500x500.png',
                        name: 'BAO'
                    }
                }, canPlay = true;
            $scope.chooseItem = function(id) {
                if (canPlay) {
                    playerChoose = getItem(id >= 3 ? (Date.now()) % 3 : id);
                    $timeout(function() {
                        comChoose = getItem(Date.now() % 3);
                        showChoose();

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

            function replay() {
                canPlay = true;
            }

            function checkWin() {
                if (playerChoose.id === comChoose.id) {
                    result = "tie";
                } else if (playerChoose.id === 0 && comChoose.id === 1) {
                    result = "win";
                } else if (playerChoose.id === 2 && comChoose.id === 0) {
                    result = "win";
                } else if (playerChoose.id === 1 && comChoose.id === 2) {
                    result = "win";
                } else {
                    result = "loose";
                }

                if (result === "tie") {
                    notification.alert(playerChoose.name + " === " + comChoose.name, replay, "Tie", "Meh");
                } else if (result === "win") {
                    notification.alert(message(playerChoose, comChoose), replay, "You Win!", "OK");
                } else {
                    notification.alert(message(comChoose, playerChoose), replay, "You Lose", "Bummer");
                }
                navigator.notification.vibrate(100);
            };

            function message(win, lose) {
                return win.name + " beat " + lose.name;
            }

            function hideChoose() {
                angular.element(document.getElementById('result')).html('');
                checkWin();
            }

            function showChoose() {
                angular.element(document.getElementById('result')).append('<img src="img/' + playerChoose.src + '" class="result-player1">');
                angular.element(document.getElementById('result')).append('<img src="img/' + comChoose.src + '" class="result-player2">');
                $timeout(hideChoose, 3000);
            };

        }
    ])
    .controller('TwoPlayerCtrl', ['$scope', 'cordovaReady', '$timeout', '$location', 'notification',
        function($scope, cordovaReady, $timeout, $location, notification) {
            var choice = null,
                opponentsChoice = null,
                listening = false,
                mimeType = "game/oantuxi",
                items = {
                    BUA: {
                        id: 0,
                        src: 'bua_500x500.png',
                        name: 'BUA'
                    },
                    KEO: {
                        id: 1,
                        src: 'keo_500x500.png',
                        name: 'KEO'
                    },
                    BAO: {
                        id: 2,
                        src: 'bao_500x500.png',
                        name: 'BAO'
                    }
                };
            $scope.chooseItem = function(id) {
                if (listening) {
                    return;
                }
                choice = getItem(id);
                var ndefMessage = [
                    ndef.mimeMediaRecord(mimeType, nfc.stringToBytes("" + id))
                ];

                nfc.share(
                    ndefMessage,
                    function() {
                        navigator.notification.vibrate(100);
                    }, function() {
                        alert("Failed to share tag.");
                    }
                );
                angular.element(document.getElementById('result')).append('<img src="img/' + choice.src + '" class="result-player1">');
                listening = true;
            }

            function message(win, lose) {
                return win.name + " beat " + lose.name;
            }

            function stop() {
                nfc.unshare();
                listening = false;
            }

            function getItem(id) {
                for (var item in items) {
                    if (items[item].id == id) {
                        return items[item];
                    }
                }
            };

            function onNfc() {
                if (!listening) {
                    return;
                }

                var tag = nfcEvent.tag,
                    records = tag.ndefMessage,
                    result;
                opponentsChoice = getItem(parseInt(nfc.bytesToString(records[0].payload)))
                angular.element(document.getElementById('result')).append('<img src="img/' + opponentsChoice.src + '" class="result-player2">');
                checkWin();
                $timeout(hideChoose, 3000);

            };

            function hideChoose() {
                angular.element(document.getElementById('result')).html('');
            }

            function checkWin() {
                if (choice.id === opponentsChoice.id) {
                    result = "tie";
                } else if (choice.id === 0 && opponentsChoice.id === 1) {
                    result = "win";
                } else if (choice.id === 2 && opponentsChoice.id === 0) {
                    result = "win";
                } else if (choice.id === 1 && opponentsChoice === 2) {
                    result = "win";
                } else {
                    result = "loose";
                }

                if (result === "tie") {
                    navigator.notification.alert(choice.name + " === " + opponentsChoice.name, replay, "Tie", "Meh");
                } else if (result === "win") {
                    navigator.notification.alert(message(choice, opponentsChoice), replay, "You Win!", "OK");
                } else {
                    navigator.notification.alert(message(opponentsChoice, choice), replay, "You Lose", "Bummer");
                }
                navigator.notification.vibrate(100);
            }

            function win() {
                console.log("Listening for tags with mime type " + mimeType);
            }

            function fail() {
                alert('Failed to register mime type ' + mimeType + ' with NFC');
                $location.path('/');
            }


            nfc.addMimeTypeListener(mimeType, onNfc, win, fail);


        }
    ]);
