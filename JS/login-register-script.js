
var form = document.querySelector("form");
var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");
var inputs = document.querySelectorAll("input");

for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("blur", function () {
        validateField(this);
    });

    inputs[i].addEventListener("input", function () {
        clearError(this);
    });
}



function showError(input, message) {
    clearError(input);

    var error = document.createElement("p");
    error.className = "error-message";
    error.textContent = message;

    var inputWrapper = input.parentNode;

    inputWrapper.style.border = "1px solid red";

    if (!inputWrapper.nextElementSibling || !inputWrapper.nextElementSibling.classList.contains("error-message")) {
        inputWrapper.parentNode.insertBefore(error, inputWrapper.nextSibling);
    }
}


function clearError(input) {
    var inputWrapper = input.parentNode;
    inputWrapper.style.border = "";

    var next = inputWrapper.nextElementSibling;
    if (next && next.classList.contains("error-message")) {
        next.remove();
    }
}

function validateField(input) {
    var value = input.value.trim();
    var id = input.id;

    if (value === "") {
        showError(input, "This field is required");
        return false;
    }

    if (id === "first-name" || id === "last-name") {
        var nameRegex = /^[A-Za-z]+$/;
        if (!nameRegex.test(value)) {
            showError(input, "Name should contain only letters");
            return false;
        }
    }

    if (id === "email") {
        var emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
        if (!emailRegex.test(value)) {
            showError(input, "Invalid email format");
            return false;
        }
    }

    if (id === "password" && value.length < 8) {
        showError(input, "Password should contain at least 8 characters");
        return false;
    }

    if (id === "repassword") {
        var password = document.getElementById("password");
        if (password && value !== password.value) {
            showError(input, "Passwords do not match");
            return false;
        }
    }

    return true;
}


form.onsubmit = function (e) {
    e.preventDefault();

    var valid = true;

    for (var i = 0; i < inputs.length; i++) {
        if (!validateField(inputs[i])) {
            valid = false;
        }
    }

    if (!valid) return;


    var formId = e.target.id;

    if (formId === "register-form") {
        saveRegisterData(e);
        window.location.replace("Login.html");
    } else if (formId === "login-form") {
        checkLoginData(e);
    }
};



function checkLoginData(e) {
    var form = e.target;
    var email = form.querySelector("#email").value.trim();
    var password = form.querySelector("#password").value;

    var userData = JSON.parse(localStorage.getItem("registeredUser"));

    if (!userData) {
        alert("No user found.");
        return;
    }

    if (email !== userData.email && password !== userData.password) {
        alert("Invalid email or password.");
    } else if (email !== userData.email) {
        alert("Invalid email");
    }
    else if (password !== userData.password) {
        alert("Invalid password");
    }
    else {
        userData.state = "loggedin";
        localStorage.setItem("registeredUser", JSON.stringify(userData));


        window.location.replace("index.html#examTopics");
    }
}


function saveRegisterData(e) {
    var registerForm = e.target;
    var firstName = registerForm.querySelector("#first-name").value.trim();
    var lastName = registerForm.querySelector("#last-name").value.trim();
    var email = registerForm.querySelector("#email").value.trim();
    var password = registerForm.querySelector("#password").value;

    var userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        state: "registerd"
    };

    localStorage.setItem("registeredUser", JSON.stringify(userData));
}



function togglePassword(button) {
    var input = button.parentNode.querySelector("input");
    var img = button.querySelector("img");

    if (input.type === "password") {
        input.type = "text";
        img.src = "images/visibility_off.svg";
        img.alt = "hide password";
    } else {
        input.type = "password";
        img.src = "images/visibility_on.svg";
        img.alt = "show password";
    }
}