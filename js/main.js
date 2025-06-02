document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeDisplay = document.querySelector('.time');
    const statusBox = document.getElementById('status-box');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const totalWorkTimeDisplay = document.getElementById('total-work-time');
    const workTimeInput = document.getElementById('work-time');
    const breakTimeInput = document.getElementById('break-time');
    const workAlarm = document.getElementById('work-alarm');
    const breakAlarm = document.getElementById('break-alarm');

    // Timer state
    let timerState = {
        isRunning: false,
        isWorkMode: true,
        timeLeft: workTimeInput.value * 60,
        workDuration: workTimeInput.value * 60,
        breakDuration: breakTimeInput.value * 60,
        totalWorkTime: 0,
        timerInterval: null
    };

    // Initialize display
    updateTimeDisplay();

    // Event Listeners
    startPauseBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    workTimeInput.addEventListener('change', updateWorkTime);
    breakTimeInput.addEventListener('change', updateBreakTime);

    // Functions
    function toggleTimer() {
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    function startTimer() {
        // Show status box when timer starts
        statusBox.style.display = 'block';
        
        timerState.isRunning = true;
        startPauseBtn.textContent = 'Ⅱ';
        
        // Update UI based on current mode
        updateTimerUI();
        
        timerState.timerInterval = setInterval(() => {
            if (timerState.timeLeft > 0) {
                timerState.timeLeft--;
                
                // Only increment total work time during work mode
                if (timerState.isWorkMode) {
                    timerState.totalWorkTime++;
                    updateTotalWorkTimeDisplay();
                }
                
                updateTimeDisplay();
            } else {
                // Time is up
                clearInterval(timerState.timerInterval);
                
                // Play appropriate alarm
                if (timerState.isWorkMode) {
                    workAlarm.play();
                } else {
                    breakAlarm.play();
                }
                
                // Switch modes
                timerState.isWorkMode = !timerState.isWorkMode;
                timerState.timeLeft = timerState.isWorkMode ? timerState.workDuration : timerState.breakDuration;
                
                // Update UI for new mode
                updateTimerUI();
                updateTimeDisplay();
                
                // Restart timer
                startTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        timerState.isRunning = false;
        clearInterval(timerState.timerInterval);
        startPauseBtn.textContent = '▶';
        
        // Update UI for paused state
        document.body.className = 'paused';
        statusBox.textContent = '一時停止中';
        statusBox.style.display = 'block';
    }

    function resetTimer() {
        // Stop the timer
        clearInterval(timerState.timerInterval);
        
        // Reset input fields to default values
        workTimeInput.value = 25;
        breakTimeInput.value = 5;
        
        // Reset timer state
        timerState.isRunning = false;
        timerState.isWorkMode = true;
        timerState.workDuration = 25 * 60; // 25 minutes in seconds
        timerState.breakDuration = 5 * 60; // 5 minutes in seconds
        timerState.timeLeft = timerState.workDuration;
        timerState.totalWorkTime = 0;
        
        // Reset UI
        startPauseBtn.textContent = '▶';
        document.body.className = '';
        statusBox.style.display = 'none';
        
        // Update displays
        updateTimeDisplay();
        updateTotalWorkTimeDisplay();
    }

    function updateWorkTime() {
        const newValue = parseInt(workTimeInput.value);
        if (newValue >= 1 && newValue <= 99) {
            timerState.workDuration = newValue * 60;
            
            // If in work mode and not running, update the displayed time
            if (timerState.isWorkMode && !timerState.isRunning) {
                timerState.timeLeft = timerState.workDuration;
                updateTimeDisplay();
            }
        } else {
            // Reset to valid value if input is invalid
            workTimeInput.value = Math.min(Math.max(1, newValue), 99);
            updateWorkTime();
        }
    }

    function updateBreakTime() {
        const newValue = parseInt(breakTimeInput.value);
        if (newValue >= 1 && newValue <= 99) {
            timerState.breakDuration = newValue * 60;
            
            // If in break mode and not running, update the displayed time
            if (!timerState.isWorkMode && !timerState.isRunning) {
                timerState.timeLeft = timerState.breakDuration;
                updateTimeDisplay();
            }
        } else {
            // Reset to valid value if input is invalid
            breakTimeInput.value = Math.min(Math.max(1, newValue), 99);
            updateBreakTime();
        }
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(timerState.timeLeft / 60);
        const seconds = timerState.timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateTotalWorkTimeDisplay() {
        const minutes = Math.floor(timerState.totalWorkTime / 60);
        const seconds = timerState.totalWorkTime % 60;
        totalWorkTimeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function updateTimerUI() {
        if (timerState.isWorkMode) {
            document.body.className = 'work-mode';
            statusBox.textContent = '作業中';
        } else {
            document.body.className = 'break-mode';
            statusBox.textContent = '休憩中';
        }
    }
});
