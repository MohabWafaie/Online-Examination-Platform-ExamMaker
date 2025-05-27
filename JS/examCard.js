window.userAnswers = []; 

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    const questionContainer = document.getElementById("question-container");
  
    let cards = [];
    let currentCard = 0;
  
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const clearBtn = document.getElementById("clear-btn");

    const flaggedContainer = document.getElementById("flagged-questions-container");
    const flaggedQuestions = new Set(); // To prevent duplicates

  
    fetch('JSON/exams.json')
      .then(response => response.json())
      .then(data => {
        const exam = data.exams.find(exam => exam.title === subject);
        if (exam) {
          renderQuestions(exam.questions);
        } else {
          console.error("Subject not found");
        }
      });

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

  
    function renderQuestions(questions) {
      questionContainer.innerHTML = "";
  
      const shuffledQuestions = shuffleArray([...questions.map((q, i) => ({ ...q, originalIndex: i }))]);
  
      shuffledQuestions.forEach((q, index) => {
        const div = document.createElement("div");
        div.classList.add("question");
        div.style.display = "none";
  
        const p = document.createElement("p");
        p.textContent = q.question;
        div.appendChild(p);
  
        q.choices.forEach(choice => {
          const label = document.createElement("label");
          label.innerHTML = `
            <input type="radio" name="q${index}" value="${choice}" onchange="userAnswers[${shuffledQuestions[index].originalIndex}] = this.value">
            ${choice}
          `;
          div.appendChild(label);
        });
        
  
        questionContainer.appendChild(div);
      });
  
      cards = document.querySelectorAll(".question");
      showCard(currentCard);

      const flagBtn = document.querySelector(".flag");
      flagBtn.addEventListener("click", () => toggleFlag(currentCard));

    }
  
    function showCard(index) {
      cards.forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
      });
  
      prevBtn.style.display = index > 0 ? "flex" : "none";
      nextBtn.style.display = index < cards.length - 1 ? "flex" : "none";
    
      const progressText = document.getElementById("question-progress");
      if (progressText) {
            progressText.textContent = `Question ${index + 1} of ${cards.length}`;
  }
    }
  
    nextBtn.onclick = () => {
      if (currentCard < cards.length - 1) {
        currentCard++;
        showCard(currentCard);
      }
    };
  
    prevBtn.onclick = () => {
      if (currentCard > 0) {
        currentCard--;
        showCard(currentCard);
      }
    };
  
    clearBtn.onclick = () => {
      const currentQuestion = cards[currentCard];
      const selectedOptions = currentQuestion.querySelectorAll('input[type="radio"]');
      selectedOptions.forEach(radio => radio.checked = false);
    };

    function toggleFlag(index) {
        if (flaggedQuestions.has(index)) {
          flaggedQuestions.delete(index);
          // Remove from flagged container
          const allFlags = flaggedContainer.querySelectorAll(".flaggedQuest");
          allFlags.forEach(el => {
            if (el.textContent.includes(`Question ${index + 1}`)) {
              flaggedContainer.removeChild(el);
            }
          });
        } else {
          flaggedQuestions.add(index);
          const flaggedDiv = document.createElement("div");
          flaggedDiv.classList.add("flaggedQuest");
          flaggedDiv.innerHTML = `
            <p>Question ${index + 1}
              <svg class="svg-inline--fa fa-flag" aria-hidden="true" focusable="false"
                                    data-prefix="fas" data-icon="flag" role="img" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512" data-fa-i2svg="">
                                    <path fill="currentColor"
                                        d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z">
                                    </path>
                                </svg>
            </p>
            <svg class="svg-inline--fa fa-arrow-right flagArrow" aria-hidden="true" focusable="false"
                                data-prefix="fas" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512" data-fa-i2svg="">
                                <path fill="currentColor"
                                    d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z">
                                </path>
                            </svg>
          `;
          flaggedDiv.onclick = () => {
            currentCard = index;
            showCard(currentCard);
          };
          flaggedContainer.appendChild(flaggedDiv);
        }
      }      
      
  });
  