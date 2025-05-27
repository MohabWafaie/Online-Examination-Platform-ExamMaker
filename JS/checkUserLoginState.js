

var signItems = document.querySelector(".sign-items");
var login = document.querySelector(".login");
var register = document.querySelector(".register");


var heroGetStartBtn = document.getElementById("heroGetStartBtn");

var topicCards = document.getElementsByClassName("topic-card");



window.onload = function () {
    

    var userLoginState = UserLoginState();

    var checkLoginState=userLoginState[0];



    navAndHeroEdit(userLoginState);

    topicCardOnClick(checkLoginState);

    
};


function navAndHeroEdit(userLoginState){
    switch (userLoginState[0]) {
        case "newUser":
            heroGetStartBtn.onclick = function () {
                document.location = 'Register.html';
            };

            break;

        case "registerd":
            heroGetStartBtn.onclick = function () {
                document.location = 'Login.html';
            };
            break;

        case "loggedin":

            login.style.display = "none";
            register.style.display = "none";


            var img = document.createElement("img");
            img.src = "images/account.svg";
            img.alt = "account";


            var paragraph = document.createElement("p");
            paragraph.textContent = userLoginState[1];

            signItems.appendChild(img);
            signItems.appendChild(paragraph);


            heroGetStartBtn.onclick = function () {
                document.location.hash = "examTopics";
            };
            break;
    }
}


function topicCardOnClick(checkLoginState) {
    for (var i = 0; i < topicCards.length; i++) {
        topicCards[i].onclick = function () {
            var subject = this.querySelector("h3").textContent;
            localStorage.setItem("selectedSubject", subject); 
            var userLoginState = UserLoginState();
            var checkLoginState = userLoginState[0];

            switch (checkLoginState) {
                case "newUser":
                    document.location = 'Register.html';
                    break;

                case "registerd":
                    document.location = 'Login.html';
                    break;

                case "loggedin":
                    document.location = 'Exam.html?subject=' + subject; 
                    break;
            }
        };
    }
}



function UserLoginState() {
    var userData = JSON.parse(localStorage.getItem("registeredUser"));

    if (!userData) {
        return ["newUser"];
    } else {
        return [userData.state, userData.firstName + " " + userData.lastName];
    }
}
