const signupForm = document.getElementById("signup-form");
const passwordInputEl = document.getElementById("password");
const passwordLengthErrorEl = document.getElementById("password-length-error");
const signupLoaderEl = document.getElementById("signup-loader");

console.log(signupForm);
//validating password length
const validatePasswordLength = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (signupForm.password.value.length < 6) {
    passwordLengthErrorEl.style.display = "block";
    signupLoaderEl.style.display = "none";

  } else {
    passwordLengthErrorEl.style.display = "none";
  }
};
passwordInputEl.addEventListener("blur", validatePasswordLength);
//sign up functionality
const handleSignup = (e) => {
  e.preventDefault();
  signupLoaderEl.style.display = "block";
  const userName = signupForm.uname.value;
  const email = signupForm.email.value;
  const password = signupForm.password.value;
  //firebase auth function
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      console.log(cred.user.uid);
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({
          uname: signupForm.uname.value,
          email: signupForm.email.value,
        })
        .then(() => {
          db.collection("accounts")
            .doc(cred.user.uid)
            .collection("accounts")
            .doc(cred.user.uid)
            .set({
              accounts: [
                { name: "Cash", amount: 0, id: "CASH" },
                { name: "Savings", amount: 0, id: "SAVINGS" },
              ],
            });
        })
        .then(() => {
          db.collection("transactions").doc(cred.user.uid).set({
            incomes: [],
            expenses: [],
          });
        });
    })
    .then(() => {
      signupLoaderEl.style.display = "none";
      window.location.assign("../login.html");
      console.log("account is created ");
    })
    .catch((err) => {
      signupLoaderEl.style.display = "none";

      // Use setTimeout to delay showing the alert
      setTimeout(() => {
        if (err) {
          alert(`Following error occurred : ${err.message}`);
        }
      }, 100); // You can use a very short delay like 0 milliseconds
    });
};
//sign up the user
signupForm.addEventListener("submit", handleSignup);
