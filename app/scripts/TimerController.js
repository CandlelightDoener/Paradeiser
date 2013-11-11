function TimerController($scope, $timeout) {

    $scope.seconds = 0;

    var repeatUntilStopped;

    $scope.stopTimer = function() {
        $timeout.cancel(repeatUntilStopped);
    };

    $scope.countdown = function () {
        if (timeLeft()) {
            tickAndPaint();
            repeatUntilStopped = $timeout($scope.countdown, 50);
            //repeatUntilStopped = setTimeout(function() {$scope.countdown();}, 1000);
        }

        function timeLeft() {
            return $scope.minutes + $scope.seconds > 0;
        }

        function tickAndPaint() {
            if ($scope.seconds == 0) {
                canvasRestoreAllSeconds();
                $scope.seconds = 59;

                $scope.minutes--;
                canvasUpdateMinutes();
            }

            $scope.seconds--;
            canvasSubtractSeconds();
        }
    };

    /////////////////////////////////////
    // Canvas  <-- belongs to different class?
    /////////////////////////////////////

    var canvas = $("#canvas")[0];
    var context = canvas.getContext('2d');
    var strokeColor = 'black';
    var radiusClock = 150;
    var radiusMinutes = 140;
    var radiusSeconds = 130;

    $scope.canvasPaintClock = function () {
        paintArc(strokeColor, radiusClock, 0, 2 * Math.PI, true, false);
    };

    function canvasRestoreAllSeconds() {
        //circle in non-bg color shows all seconds which are left in this minute
        paintArc(strokeColor, radiusSeconds, 0, 2 * Math.PI, false, false);
    }

    function canvasUpdateMinutes() {
        //reset arc to bg-color
        paintArc($scope.color, radiusMinutes, 0, 2 * Math.PI, false, false);

        //let's say, max is 30 minutes
        if ($scope.minutes > 0) {
            var oben = 2 * Math.PI - 0.5 * Math.PI;
            var nochUebrig = 2 * Math.PI * ($scope.minutes / 30) - 0.5 * Math.PI;
            paintArc(strokeColor, radiusMinutes, oben, nochUebrig, false, false);
        }
    }

    function canvasSubtractSeconds() {
        //subtract seconds by painting the span [sec .. 60] in bg-color
        //see http://www.html5canvastutorials.com/tutorials/html5-canvas-arcs/
        var oben = 2 * Math.PI - 0.5 * Math.PI;
        var nochUebrig = 2 * Math.PI * ($scope.seconds / 60) - 0.5 * Math.PI;

        paintArc($scope.color, radiusSeconds, oben, nochUebrig, false, true);
    }

    function paintArc(strokeColor, radius, from, to, fillWithBgColor, ccw) {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        context.beginPath();
        context.arc(centerX, centerY, radius, from, to, ccw);
        context.lineWidth = 5;
        context.strokeStyle = strokeColor;
        context.stroke();

        if (fillWithBgColor) {
            context.fillStyle = $scope.color;
            context.fill();
        }
    }
}