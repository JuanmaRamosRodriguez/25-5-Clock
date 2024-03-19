document.addEventListener("DOMContentLoaded", function() {
    let breakIncrement = document.getElementById('break-increment');
    let breakDecrement = document.getElementById('break-decrement');
    let sessionIncrementButton = document.getElementById('session-increment');
    let sessionDecrementButton = document.getElementById('session-decrement');
    let startStopButton = document.getElementById('start_stop');
    let resetButton = document.getElementById('reset');

    let breakLength = document.getElementById('break-length');
    let sessionLength = document.getElementById('session-length');
    let timeLeft = document.getElementById('time-left');
    let isBreak = false;

    let timer;
    let timerStatus = "begin";
    let alarmAudio = new Audio('alarma.mp3');

    function updateTimeDisplay(timeString) {
        timeLeft.innerText = timeString;
    }

    function playAlarmSound() {
        console.log("Reproduciendo sonido de alarma...");
        alarmAudio.currentTime = 0;
        alarmAudio.play();
        alarmPlay = true;

        setTimeout(() => {
            console.log("Deteniendo sonido de alarma...");
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
            alarmPlay = false; 
        }, 2000);
    }

    function decrementTime(timeString) {
        let timeDisplay = timeString.split(":");
        let minuteDisplay = parseInt(timeDisplay[0]);
        let secondDisplay = parseInt(timeDisplay[1]);

        if(minuteDisplay === 0 && secondDisplay === 0){
            if(!alarmPlay){
                playAlarmSound();
                alarmPlay = true;
            }
            return "0:00";
        }

        secondDisplay -= 1;

        if (secondDisplay === -1) {
            if (minuteDisplay === 0) {
               minuteDisplay = parseInt(sessionLength.innerText);
            }
            secondDisplay = 5;
            minuteDisplay -= 1;
            alarmPlay = false;
        }

        if (secondDisplay < 10) {
            secondDisplay = "0" + secondDisplay;
        }

        return minuteDisplay + ":" + secondDisplay;
    }

    function incrementBreakLength() {
        let currentLength = parseInt(breakLength.innerText);
        if(currentLength < 60){
            breakLength.innerText = currentLength + 1;
        }
    }

    function decrementBreakLength() {
        let currentLength = parseInt(breakLength.innerText);
        if (currentLength > 1) {
            breakLength.innerText = currentLength - 1;
        }
    }

    function incrementSessionLength() {
        sessionLength.innerText = parseInt(sessionLength.innerText) + 1;
        updateTimeDisplay(sessionLength.innerText + ":00");
    }

    function decrementSessionLength() {
        let currentLength = parseInt(sessionLength.innerText);
        if (currentLength > 1) {
            sessionLength.innerText = currentLength - 1;
            updateTimeDisplay(sessionLength.innerText + ":00");
        }
    }

    breakIncrement.addEventListener("click", incrementBreakLength);
    breakDecrement.addEventListener("click", decrementBreakLength);
    sessionIncrementButton.addEventListener("click", incrementSessionLength);
    sessionDecrementButton.addEventListener("click", decrementSessionLength);
    startStopButton.addEventListener("click", () => {
        if (timerStatus === "begin" || timerStatus === "stopped") {
            console.log('empezar el tiempo');
            timerStatus = "counting";
            timer = setInterval(() => {
                timeLeft.innerText = decrementTime(timeLeft.innerText);
                if(timeLeft.innerText === "0:00"){
                    if(!isBreak){
                        isBreak = true;
                        timeLeft.innerText = breakLength.innerText + ":00";
                        document.getElementById('timer-label').innerText = 'Break';
                    }else {
                        isBreak = false;
                        timeLeft.innerText = breakLength.innerText + ":00";
                        document.getElementById('timer-label').innerText = 'Session';
                    }
                }
            }, 1000);

        } else if (timerStatus === "counting") {
            console.log('parar tiempo(za warudoo)');
            timerStatus = "stopped";
            clearInterval(timer);
        }
    });

    resetButton.addEventListener("click", () => {
        console.log('reseteo del tiempo');
        clearInterval(timer);
        timerStatus = "begin";
        updateTimeDisplay(sessionLength.innerText + ":00");
        isBreak = false;
        document.getElementById('timer-label').innerText = 'Session';
    });
});
