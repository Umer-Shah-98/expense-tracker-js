const addAccountButton = document.getElementById("add-account-button");
const addAccountForm = document.getElementById("add-account-form");
const handleAddAccount = (e) => {
  if (key) {
    e.preventDefault();
    const accountName = addAccountForm.account.value;
    const accountAmount = addAccountForm.amount.value;

    const newAccount = {
      name: accountName,
      amount: Number(accountAmount),
      id: accountName.toUpperCase(),
    };
    let bankOptions;
    db.collection("accounts")
      .doc(key)
      .collection("accounts")
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let docData = doc.data();
          console.log(docData);
          bankOptions = docData.accounts;
          console.log(bankOptions);
          bankOptions.push(newAccount);
        });
        return bankOptions;
      })
      .then((bankOptions) => {
        db.collection("accounts")
          .doc(key)
          .collection("accounts")
          .doc(key)
          .set({ accounts: bankOptions });
      })
      .then(() => {
        alert(
          `New Bank Account: ${newAccount.name} with amount RS. ${newAccount.amount} is added successfully`
        );
      });
  }
};

addAccountForm.addEventListener("submit", handleAddAccount);
