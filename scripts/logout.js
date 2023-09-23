//logout the user
const handleLogOut = (e) => {
  let key = localStorage.getItem("userId");
  e.preventDefault();
  auth
    .signOut()
    .then(() => {
      console.log("User is logged Out");
      localStorage.removeItem(key);
    })
    .then(() => {
      window.location.assign("../login.html");
    });
};

logOutButton.addEventListener("click", handleLogOut);
userProfile.addEventListener("click", () => {
  userProfile.style.display = "none";
  logOutButton.style.display = "block";
});
