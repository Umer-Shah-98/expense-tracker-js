//login
const loginForm = document.getElementById("login-form");
console.log(loginForm);
//login the user
const handleLogin = (e) => {
  e.preventDefault();
  console.log("ki");
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(`User is Logged In with uid : ${cred.user.uid}`);
      localStorage.setItem("userId", cred.user.uid);
      console.log(localStorage.getItem("userId"));
      let key = localStorage.getItem("userId");
      console.log(key);
      db.collection("categories")
        .doc(key)
        .set({
          categories: [
            "Education",
            "Shopping",
            "Health",
            "Food",
            "Transport",
            "Other",
          ],
        });
    })

    .then(() => {
      window.location.assign("../dashboard.html");
    })

    .catch((err) => {
      alert(`You have entered an invalid email, or password... Try agin!!`);
    });
};
loginForm.addEventListener("submit", handleLogin);
