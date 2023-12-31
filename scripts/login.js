//login
const loginForm = document.getElementById("login-form");
const loaderEl = document.getElementById("loader");
const showHidePasswordEl = document.getElementById("show-hide-password");
const passwordEl = document.getElementById("password");
console.log(loginForm);

//toggle password visibility function
showHidePasswordEl.addEventListener("click", () => {
  const type =
    passwordEl.getAttribute("type") === "password" ? "text" : "password";
  passwordEl.setAttribute("type", type);
  showHidePasswordEl.innerText = type === "password" ? "Show" : "Hide";
});
//login the user
const handleLogin = (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  loaderEl.style.display = "block";

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(`User is Logged In with uid : ${cred.user.uid}`);
      localStorage.setItem("userId", cred.user.uid);
      console.log(localStorage.getItem("userId"));
      return cred.user.uid;
    })
    .then((uid) => {
      const categoriesData = {
        categories: [
          "Education",
          "Shopping",
          "Health",
          "Food",
          "Transport",
          "Other",
        ],
      };

      return db.collection("categories").doc(uid).set(categoriesData);
    })
    .then(() => {
      loaderEl.style.display = "none";
      window.location.assign("../dashboard.html");
    })
    .catch((err) => {
      loaderEl.style.display = "none";
      if (err) {
        setTimeout(() => {
          alert(
            `You have entered an invalid email or password. Please try again.`
          );
        }, 100);
      }
    });
};

loginForm.addEventListener("submit", handleLogin);
