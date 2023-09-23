// this is a testing js file to check whether if a module works properly or not
const fetchData = (key) => {
  db.collection("accounts")
    .doc(key)
    .collection("accounts")
    .onSnapshot((snapshots) => {
      snapshots.forEach((doc) => {
        console.log(doc.data());
      });
    });
};

fetchData(key);
console.log(fetchData(key));
// const newOption = document.createElement("option");
// const optionText = document.createTextNode("select");
// newOption.appendChild(optionText);
// selectAccountOptionEl.appendChild(newOption);
// console.log(selectAccountOptionEl);
