var examsFileData;
let startTime; 


var ipWithPortAddress="http://127.0.0.1:5500/ExamMaker-WebProject"

var submitAnswerButton = document.getElementById("submit-answer");
var headerSubjectName = document.getElementById("subjectName");



var queryString = window.location.search; 
var subjectName = queryString.split('=')[1];

headerSubjectName.textContent=subjectName;

loadExamsJsonFile();


function loadExamsJsonFile(){
    var xhrUsers = new XMLHttpRequest();

    xhrUsers.open("GET", "JSON/exams.json");
    xhrUsers.send();


    xhrUsers.addEventListener("readystatechange", function () {

        if (xhrUsers.readyState === 4 && xhrUsers.status === 200) {

            examsFileData = JSON.parse(xhrUsers.responseText);


             startTimer();

        }
    })
}

function getExamTime() {
    for (var i = 0; i < examsFileData.exams.length; i++) {
        if (examsFileData.exams[i].title === subjectName) {
            return examsFileData.exams[i].time;
        }
    }
    return 0; 
}

function startTimer(duration, timerDisplay) {

    var time=getExamTime();

     duration = time * 60;
     timerDisplay = document.getElementById("navTimer");

    var progressBar = document.getElementById("navProgressBar");
    
    var timer = duration;
     startTime = Date.now();
    var interval = setInterval(() => {
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;


        timerDisplay.textContent = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);


        var percent = (timer / duration) * 100;
        progressBar.style.width = percent + "%";

        if (percent > 66) {
            progressBar.style.backgroundColor = "#007bff";
        } else if (percent > 33) {
            progressBar.style.backgroundColor = "orange";
        } else {
            progressBar.style.backgroundColor = "red";
        }

        --timer;
        if (timer < 0) {
            clearInterval(interval);
            timerDisplay.textContent = "Time's up!";
            submitAnswerButton.click();
        }
    }, 1000);
}


function SubmitButtonAlert() {
    const examPage = document.querySelector(".examPage");
    const scoreCard = document.querySelector(".score-section");
    examPage.style.filter = "blur(20px)";
    scoreCard.style.display = "block";

    const currentExam = examsFileData.exams.find(e => e.title === subjectName);
    if (!currentExam) return;

    const correctAnswers = currentExam.questions.map(q => q.correct_answer);
    const questions = currentExam.questions;

    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
        if (userAnswers[i] === correctAnswers[i]) {
            score++;
        }
    }

    const percent = Math.round((score / correctAnswers.length) * 100);

    // Update Score Circle
    const scoreCircle = document.querySelector(".circle-inner span");
    scoreCircle.textContent = `${percent}%`;

    const pieElement = document.querySelector(".circle-container");
    if (pieElement) {
        const angle = (percent / 100) * 360;
        pieElement.style.background = `conic-gradient(#00b894 ${angle}deg, #eee ${angle}deg)`;
    }

    // Correct Answers Count
    const correctGroup = document.querySelectorAll(".progress-group")[0];
    const correctValueSpan = correctGroup.querySelector("span span:last-child");
    correctValueSpan.textContent = `${score}/${correctAnswers.length}`;
    const fillScore = correctGroup.querySelector(".fill-score");
    if (fillScore) fillScore.style.width = `${percent}%`;

    // Time Taken
    if (typeof startTime !== 'undefined') {
        const endTime = Date.now();
        const timeTakenMs = endTime - startTime;
        const minutes = Math.floor(timeTakenMs / 60000);
        const seconds = Math.floor((timeTakenMs % 60000) / 1000);
        const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
        const timeGroup = document.querySelectorAll(".progress-group")[1];
        const timeValueSpan = timeGroup.querySelector("span span:last-child");
        const fillTime = timeGroup.querySelector(".fill-time");
    
        const totalAllowedTimeMs = getExamTime() * 60 * 1000;
        const usedPercentage = Math.min(100, (timeTakenMs / totalAllowedTimeMs) * 100);
    
        if (timeValueSpan) timeValueSpan.textContent = `${formatted} min`;
        if (fillTime) fillTime.style.width = `${usedPercentage}%`;
    }
    

    // Ranking
    const rankGroup = document.querySelectorAll(".progress-group")[2];
    const rankValueSpan = rankGroup.querySelector("span span:last-child");
    const fillRank = rankGroup.querySelector(".fill-rank");

    const simulatedTop = Math.max(1, Math.min(100, 100 - percent + Math.floor(Math.random() * 10)));
    rankValueSpan.textContent = `Top ${simulatedTop}%`;
    fillRank.style.width = `${100 - simulatedTop}%`; // This line is correct IF fill indicates relative rank    
    

    // Motivation Message
    const messageHeader = document.querySelector(".chart h3");
    const messageParagraph = document.querySelector(".chart p");

    if (percent >= 50) {
        messageHeader.textContent = "Great job!";
        messageParagraph.textContent = "You've passed the exam";
    } else {
        messageHeader.textContent = "Keep Practicing!";
        messageParagraph.textContent = "You can do better next time!";
    }

    // Save to localStorage
    localStorage.setItem("examResults", JSON.stringify({
        subject: subjectName,
        userAnswers,
        correctAnswers,
        questions
    }));
}


