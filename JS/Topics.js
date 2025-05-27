document.addEventListener("DOMContentLoaded", () => {
    const slider = document.getElementById("topics-slider");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
  
    const scrollStep = 320; 
  
    prevBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: -scrollStep,
        behavior: "smooth"
      });
    });
  
    nextBtn.addEventListener("click", () => {
      slider.scrollBy({
        left: scrollStep,
        behavior: "smooth"
      });
    });
  
    const startButtons = document.querySelectorAll(".topic-card button");
    startButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href = "Exam.html";
      });
    });
  });
  