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
    .controller('TwoPlayerCtrl', ['$scope', 'cordovaReady', '$timeout', '$location',
        function($scope, cordovaReady, $timeout, $location) {
            var choice = null,
                opponentsChoice = null,
                listening = false,
                mimeType = "game/oantuxi",
                items = {
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
                if (/s$/.test(win)) {
                    return win + " beat " + lose;
                } else {
                    return win + " beats " + lose;
                }
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
                } else if (choice === "Rock" && opponentsChoice === "Scissors") {
                    result = "win";
                } else if (choice === "Paper" && opponentsChoice === "Rock") {
                    result = "win";
                } else if (choice === "Scissors" && opponentsChoice === "Paper") {
                    result = "win";
                } else {
                    result = "loose";
                }

                if (result === "tie") {
                    navigator.notification.alert(choice + " === " + opponentsChoice, stop, "Tie", "Meh");
                } else if (result === "win") {
                    navigator.notification.alert(message(choice, opponentsChoice), stop, "You Win!", "OK");
                } else {
                    navigator.notification.alert(message(opponentsChoice, choice), stop, "You Lose", "Bummer");
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
