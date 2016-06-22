/**
 * @license
 * Copyright (c) 2016 Alejandro Gomez Moron, Ignacio Gonzalez Bullon.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


/**
 * Angular promise decorator to be rejected if it's still pending and the timeout is exceeded.
 * @param {type} angular
 * @returns {angular.module}
 * @author Alejandro Gomez <agommor@gmail.com>
 * @author Ignacio Gonzalez <natete981@gmail.com>
 * @since 20160308
 */
(function () {
  angular
    .module('ng-q-timeout-decorator', [])
    .constant('ngQTimeoutDecoratorConfig', {
      // timeout in seconds
      timeout: 60,
      timeoutFunction: undefined,
      timeoutMessage: 'Promise timeout exceeded!'
    })
    .config(config);

  /* @ngInject */
  function config($provide) {
    // I wish we could inject $timeout into config function
    // instead of using setTimeout directly.
    $provide.decorator('$q', decorateQ);

    /* @ngInject */
    function decorateQ($delegate, $exceptionHandler, ngQTimeoutDecoratorConfig) {
      var _defer = $delegate.defer;
      $delegate.defer = function () {
        var deferred = _defer();

        // flag to know if the promise was resolved
        var pending = true;

        // getting the original deferred methods
        var _resolve = deferred.resolve;
        var _reject = deferred.reject;
        var _notify = deferred.notify;

        // Defining the timer function
        var _timer = setTimeout(timeoutExceeded, ngQTimeoutDecoratorConfig.timeout * 1000);

        // Decorating methods
        deferred.resolve = function () {
          pending = false;
          // cancelling the timeout execution
          clearTimeout(_timer);
          return _resolve.apply(deferred, arguments);
        };
        deferred.reject = function () {
          pending = false;
          // cancelling the timeout execution
          clearTimeout(_timer);
          return _reject.apply(deferred, arguments);
        };
        deferred.notify = function () {
          pending = false;
          // cancelling the timeout execution
          clearTimeout(_timer);
          return _notify.apply(deferred, arguments);
        };

        /**
         * Function to be executed once the timeout is exceeded. Only if the promise is still pending, it will reject the
         * promise and will also execute the timeoutFunction if it's a defined function. The promise will be rejected
         * following the structure:
         *  { message: Defined message in the timeoutMessage constant, timeout: Defined timeout in the timeout constant}.
         * @returns JSON with the following data:
         *  message: Defined message in the timeoutMessage constant.
         *  timeout: Defined timeout in the timeout constant}.
         */
        function timeoutExceeded() {
          if (pending) {
            var result = {
              message: ngQTimeoutDecoratorConfig.timeoutMessage,
              timeout: ngQTimeoutDecoratorConfig.timeout
            };
            if (ngQTimeoutDecoratorConfig.timeoutFunction &&
              typeof ngQTimeoutDecoratorConfig.timeoutFunction === "function") {
              ngQTimeoutDecoratorConfig.timeoutFunction(arguments);
            }
            deferred.reject(result);
            $exceptionHandler(result);
          }
        }

        return deferred;
      };

      return $delegate;
    }

  }
})();
