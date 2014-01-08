angular.module('App.services', [])
    .factory('cordovaReady', [
        function() {
            return function(fn) {
                var queue = [],
                    impl = function() {
                        queue.push([].slice.call(arguments));
                    };

                document.addEventListener('deviceready', function() {
                    queue.forEach(function(args) {
                        fn.apply(this, args);
                    });
                    impl = fn;
                }, false);

                return function() {
                    return impl.apply(this, arguments);
                };
            };
        }
    ])
    .factory('notification', function ($rootScope, cordovaReady) {
        return {
          alert: cordovaReady(function (message, alertCallback, title, buttonName) {
            navigator.notification.alert(message, function () {
              var that = this,
                args = arguments;
              
              $rootScope.$apply(function () {
                alertCallback.apply(that, args);
              });
            }, title, buttonName);
          }),
          confirm: cordovaReady(function (message, confirmCallback, title, buttonLabels) {
            navigator.notification.confirm(message, function () {
              var that = this,
                args = arguments;
              
              $rootScope.$apply(function () {
                confirmCallback.apply(that, args);
              });
            }, title, buttonLabels);
          }),
          beep: function (times) {
            navigator.notification.beep(times);
          },
          vibrate: function (milliseconds) {
            navigator.notification.vibrate(milliseconds);
          }
        };
      });
    ;
