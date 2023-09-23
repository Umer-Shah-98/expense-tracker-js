const signupForm = document.getElementById("signup-form");

console.log(signupForm);

//sign up functionality
const handleSignup = (e) => {
  e.preventDefault();
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
      window.location.assign("../login.html");
      console.log("account is created ");
    })
    .catch((err) => {
      alert(`Following error occurred : ${err.message}`);
    });
};
//sign up the user
signupForm.addEventListener("submit", handleSignup);
