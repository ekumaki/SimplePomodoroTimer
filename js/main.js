document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeDisplay = document.querySelector('.time');
    const statusBox = document.getElementById('status-box');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const totalWorkTimeDisplay = document.getElementById('total-work-time');
    const workTimeInput = document.getElementById('work-time');
    const breakTimeInput = document.getElementById('break-time');
    
    // Web Audio API繧貞・譛溷喧
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // 菴懈･ｭ邨ゆｺ・浹繧堤函謌舌☆繧矩未謨ｰ
    function playWorkAlarm() {
        playLongBeepSound(880, 0.6, 'square'); // A5髻ｳ (鬮倥＞髻ｳ)繧帝聞繧√↓蜀咲函
    }
    
    // 莨第・邨ゆｺ・浹繧堤函謌舌☆繧矩未謨ｰ
    function playBreakAlarm() {
        playLongBeepSound(440, 0.6, 'sine'); // A4髻ｳ (荳ｭ髻ｳ)繧帝聞繧√↓蜀咲函
    }
    
    // 繧ｫ繧ｦ繝ｳ繝医ム繧ｦ繝ｳ髻ｳ繧貞・逕溘☆繧矩未謨ｰ
    function playCountdownBeep(isWorkMode) {
        // 菴懈･ｭ繝｢繝ｼ繝峨°莨第・繝｢繝ｼ繝峨°縺ｫ繧医▲縺ｦ髻ｳ繧貞､峨∴繧・        const frequency = isWorkMode ? 880 : 440;
        const type = isWorkMode ? 'square' : 'sine';
        playBeepSound(frequency, 0.1, type); // 遏ｭ縺・ン繝ｼ繝鈴浹
    }
    
    // 髟ｷ繧√・繝薙・繝鈴浹繧堤函謌舌☆繧矩未謨ｰ
    function playLongBeepSound(frequency, duration, type = 'sine') {
        playBeepSound(frequency, duration, type);
    }
    
    // 繝薙・繝鈴浹繧堤函謌舌☆繧矩未謨ｰ
    function playBeepSound(frequency, duration, type = 'sine') {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.5;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        
        // 髻ｳ驥上ｒ繝輔ぉ繝ｼ繝峨い繧ｦ繝医＆縺帙ｋ
        gainNode.gain.exponentialRampToValueAtTime(
            0.001, audioContext.currentTime + duration
        );
        
        // 謖・ｮ壽凾髢灘ｾ後↓蛛懈ｭ｢
        setTimeout(() => {
            oscillator.stop();
        }, duration * 1000);
    }

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
        statusBox.style.visibility = 'visible';
        statusBox.style.borderColor = ''; // 譫邱壹・濶ｲ繧呈綾縺呻ｼ・SS縺ｧ螳夂ｾｩ縺輔ｌ縺溯牡繧剃ｽｿ逕ｨ・・        
        timerState.isRunning = true;
        startPauseBtn.textContent = 'II';
        
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
                
                // Play appropriate final alarm
                if (timerState.isWorkMode) {
                    playWorkAlarm(); // 菴懈･ｭ邨ゆｺ・凾縺ｮ髟ｷ繧√・繝薙・繝鈴浹
                } else {
                    playBreakAlarm(); // 莨第・邨ゆｺ・凾縺ｮ髟ｷ繧√・繝薙・繝鈴浹
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
        startPauseBtn.textContent = '\u25b6';
        
        // Update UI for paused state
        document.body.className = 'paused';
        statusBox.textContent = '一時停止中';
        statusBox.style.visibility = 'visible';
        statusBox.style.borderColor = '';
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
        startPauseBtn.textContent = '\u25b6';
        document.body.className = '';
        statusBox.style.visibility = 'hidden';
        statusBox.style.borderColor = 'transparent';
        
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

    // Update time display with countdown beep
    function updateTimeDisplay() {
        const minutes = Math.floor(timerState.timeLeft / 60);
        const seconds = timerState.timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 3秒前からカウントダウン音を鳴らす
        if (timerState.isRunning && timerState.timeLeft <= 3 && timerState.timeLeft > 0) {
            console.log(`カウントダウン音を再生: 残り${timerState.timeLeft}秒`);
            playCountdownBeep(timerState.isWorkMode);
        }
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
