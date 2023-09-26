//html Elements
let userNameEl = document.getElementById("user-name");
const userProfile = document.getElementById("user-profile");
const logOutButton = document.getElementById("logout-button");
const addTransactionForm = document.getElementById("add-transaction-form");
const selectAccountOptionEl = document.getElementById("account-options");
const selectCategoryEl = document.getElementById("category-options");
const accountTable = document.getElementById("account-table");
const cashAmountEl = document.getElementById("cash-amount");
const banksAmountEl = document.getElementById("banks-amount");
const savingsAmountEl = document.getElementById("savings-amount");
const totalAmountEl = document.getElementById("total-amount");
const addIncomeButtonEl = document.getElementById("add-income-button");
const addExpenseButtonEl = document.getElementById("add-expense-button");
const transactionHistoryTable = document.getElementById(
  "transaction-history-table"
);
const transactionHistoryTbody = document.getElementById(
  "transaction-history-table-body"
);
const incomeBar = document.getElementById("income-bar");
const expenseBar = document.getElementById("expense-bar");
const incomePercentageSpan = document.getElementById("income-percentage-span");
const expensePercentageSpan = document.getElementById(
  "expense-percentage-span"
);
const incomeLoaderEl = document.getElementById("income-transaction-loader");
const expenseLoaderEl = document.getElementById("expense-transaction-loader");
const cashAmountLoaderEl = document.getElementById("cash-amount-loader");
const savingsAmountLoaderEl = document.getElementById("savings-amount-loader");
const banksAmountLoaderEl = document.getElementById("banks-amount-loader");

// userId for auth and access
let key = localStorage.getItem("userId");

const setUpUI = async (user) => {
  if (user) {
    const userSnapshot = await db.collection("users").doc(user.uid).get();

    const userData = userSnapshot.data();
    const userName = `Welcome ${userData.uname}`;

    // Get the typewriter container and text elements
    const typewriterContainer = document.getElementById("typewriter-container");
    const typewriterText = document.getElementById("typewriter-text");

    // Set the initial text content of the typewriter text element
    typewriterText.textContent = "";

    // Split the userName into characters
    const characters = userName.split("");
    let index = 0;

    // Function to add characters with typewriter effect
    function typeCharacter() {
      if (index < characters.length) {
        typewriterText.textContent += characters[index];
        index++;
        setTimeout(typeCharacter, 100); // Adjust the typing speed here (in milliseconds)
      }
    }

    // Start the typewriter effect
    typeCharacter();

    // Make the typewriter container visible
    typewriterContainer.style.visibility = "visible";
  }
};

//getting Cash Amount
const cashAmount = (accounts) => {
  let cashAccount = accounts.filter((account) => account.id === "CASH");
  let sum = cashAccount[0].amount;
  cashAmountLoaderEl.style.display = "none";
  cashAmountEl.innerText = `RS. ${sum}/-`;
};

//getting Savings Amount
const savingsAmount = (accounts) => {
  let cashAccount = accounts.filter((account) => account.id === "SAVINGS");
  let sum = cashAccount[0].amount;
  savingsAmountLoaderEl.style.display = "none";
  savingsAmountEl.innerText = `RS. ${sum}/-`;
};

//getting all other banks amount
const allBanksAmount = (accounts) => {
  let allBankAccounts = accounts.filter(
    (account) => account.id !== "CASH" && account.id !== "SAVINGS"
  );
  console.log(allBankAccounts);
  if (allBankAccounts) {
    let sum = 0;
    allBankAccounts.forEach((account) => {
      sum += account.amount;
    });
    console.log(sum);
    banksAmountLoaderEl.style.display = "none";
    banksAmountEl.innerText = `RS. ${sum}/-`;
  } else {
    banksAmountLoaderEl.style.display = "none";
    banksAmountEl.innerText = `RS. ${0}/-`;
  }
};

//getting Total Amount
const totalAmount = (accounts) => {
  let sum = 0;
  accounts.forEach((account) => {
    sum += account.amount;
  });
  totalAmountEl.innerText = `PKR ${sum}`;
  console.log(sum);
};

const selectCategory = (userId) => {
  db.collection("categories")
    .doc(key) // Assuming you have a document with the same ID as the user's UID
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        const categories = userData.categories;
        const selectCategoryEl = document.getElementById("category-options");

        // Clear existing options
        selectCategoryEl.innerHTML = "";

        // Create an option element for each category
        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          selectCategoryEl.appendChild(option);
        });
      } else {
        console.log("User document not found in Firestore.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user categories:", error);
    });
};

// Call the function with the user's UID
// selectCategory(key); // Replace key with the user's UID

//rendering accounts in table
const accountsInTable = (bankOptions) => {
  bankOptions.forEach((option) => {
    console.log("table");
    const tRow = document.createElement("tr");
    tRow.classList.add(
      "bg-white",
      "border-b",
      "dark:bg-gray-800",
      "dark:border-gray-700"
    );
    const tHeading = document.createElement("th");
    tHeading.classList.add(
      "px-6",
      "py-4",
      "font-medium",
      "text-gray-900",
      "whitespace-nowrap",
      "dark:text-white"
    );
    const tData = document.createElement("td");
    tData.classList.add("px-6", "py-4");
    const tHeadingText = document.createTextNode(option.name);
    const tDataText = document.createTextNode(`PKR. ${option.amount}`);
    tHeading.appendChild(tHeadingText);
    tData.appendChild(tDataText);
    tRow.appendChild(tHeading);
    tRow.appendChild(tData);
  });
};

//User main UI
const accountsAccess = (userId) => {
  if (userId) {
    db.collection("accounts")
      .doc(userId)
      .collection("accounts")
      .onSnapshot((snapshots) => {
        snapshots.forEach((doc) => {
          let docData = doc.data();
          console.log(docData);
          let bankOptions = docData.accounts;
          console.log(bankOptions);
          cashAmount(bankOptions);
          savingsAmount(bankOptions);
          allBanksAmount(bankOptions);
          totalAmount(bankOptions);
          accountsInTable(bankOptions);
        });
      });
  }
};

// Function to render transaction history for a specific user
const renderingTransactionHistory = (key) => {
  if (key) {
    // Set up a Firestore listener for the specific user's transactions
    db.collection("transactions")
      .doc(key)
      .onSnapshot((snapshot) => {
        const transactionsData = snapshot.data();
        if (transactionsData) {
          const incomes = transactionsData.incomes;
          const expenses = transactionsData.expenses;

          // Clear the existing table rows
          transactionHistoryTbody.innerHTML = "";

          // Function to add a row to the transaction history table
          const addTransactionRow = (transaction, type) => {
            const row = document.createElement("tr");
            row.classList.add(
              "bg-white",
              "border-b",
              "dark:bg-gray-800",
              "dark:border-gray-700"
            );
            const categoryCell = document.createElement("th");
            categoryCell.classList.add(
              "px-6",
              "py-4",
              "font-bold",
              "text-gray-900",
              "whitespace-nowrap",
              "dark:text-white"
            );
            const dateCell = document.createElement("td");
            dateCell.classList.add("px-6", "py-4", "font-medium", "text-sm");
            const accountTypeCell = document.createElement("td");
            accountTypeCell.classList.add("px-6", "py-4", "font-medium");
            const amountCell = document.createElement("td");
            amountCell.classList.add("px-6", "py-4", "font-medium");
            if (type === "income") {
              amountCell.textContent = `Rs. ${transaction.amount.toFixed(2)}`;
              amountCell.style.color = "green"; // Set text color to green for income
            } else {
              amountCell.textContent = `-Rs. ${Math.abs(
                transaction.amount
              ).toFixed(2)}`;
              amountCell.style.color = "red"; // Set text color to red for expenses
            }
            dateCell.textContent = transaction.date;
            categoryCell.textContent = transaction.category;
            accountTypeCell.textContent = transaction.accountType;

            row.appendChild(categoryCell);
            row.appendChild(accountTypeCell);
            row.appendChild(dateCell);
            row.appendChild(amountCell);

            transactionHistoryTbody.appendChild(row);
          };
          let incomeTotal = 0;
          let expenseTotal = 0;
          // Add income transactions to the table
          incomes.forEach((incomeTransaction) => {
            incomeTotal += incomeTransaction.amount;
            addTransactionRow(incomeTransaction, "income");
          });

          // Add expense transactions to the table
          expenses.forEach((expenseTransaction) => {
            expenseTotal += expenseTransaction.amount;
            addTransactionRow(expenseTransaction, "expense");
          });
          const incomePercent = (
            (incomeTotal / (incomeTotal + expenseTotal)) *
            100
          ).toFixed(2);
          const expensePercent = (100 - incomePercent).toFixed(2);
          if (incomePercent >= 0 || expensePercent >= 0) {
            incomeBar.style.setProperty(
              "--income-percent",
              incomePercent + "%"
            );
            incomePercentageSpan.innerHTML = `${incomePercent}%`;
            expensePercentageSpan.innerHTML = `${expensePercent}%`;
          }
        }
      });
  }
};

// Call the function with the user's key to start listening for changes
renderingTransactionHistory(key);

//add income functionality
const handleAddIncome = async (e) => {
  e.stopPropagation();
  e.preventDefault();
  incomeLoaderEl.style.display = "block";

  const amount = Number(addTransactionForm.amount.value);
  const category = selectCategoryEl.value;
  const accountValue = selectAccountOptionEl.value;

  const amountErrorEl = document.getElementById("amount-error");
  const accountErrorEl = document.getElementById("account-error");
  const categoryErrorEl = document.getElementById("category-error");

  amountErrorEl.style.visibility = "hidden";
  accountErrorEl.style.visibility = "hidden";
  categoryErrorEl.style.visibility = "hidden";

  if (amount <= 0) {
    amountErrorEl.style.visibility = "visible";
    incomeLoaderEl.style.display = "none";
    return;
  }

  if (!accountValue) {
    accountErrorEl.style.visibility = "visible";
    incomeLoaderEl.style.display = "none";
    return;
  }

  if (!category) {
    categoryErrorEl.style.visibility = "visible";
    incomeLoaderEl.style.display = "none";
    return;
  }

  const accountsSnapshot = await db
    .collection("accounts")
    .doc(key)
    .collection("accounts")
    .get();
  const accountsData = accountsSnapshot.docs.map((doc) => doc.data());

  let updatedAccounts = [];

  accountsData.forEach((accountData) => {
    const updatedAccount = accountData.accounts.find(
      (account) => account.id === accountValue
    );

    if (updatedAccount) {
      updatedAccount.amount += amount;
      updatedAccounts.push(...accountData.accounts);
    }
  });

  await db.collection("accounts").doc(key).collection("accounts").doc(key).set({
    accounts: updatedAccounts,
  });
  //income-button Loader
  incomeLoaderEl.style.display = "none";

  const transaction = {
    category: category,
    accountType: accountValue,
    amount: amount,
    date: new Date().toDateString(),
  };

  const transactionsSnapshot = await db.collection("transactions").get();
  const transactionsData = transactionsSnapshot.docs
    .find((doc) => doc.id === key)
    .data();
  console.log(transactionsData);

  transactionsData.incomes.push(transaction);

  await db.collection("transactions").doc(key).set({
    expenses: transactionsData.expenses,
    incomes: transactionsData.incomes,
  });
  // Display a success message with the amount and account added
  alert(
    `RS. ${amount.toFixed(
      2
    )} is added to account: ${accountValue} successfully!`
  );

  // Update the account table in real-time
  updateAccountTable();
  //clear all inputs of form
  addTransactionForm.reset();
};

addIncomeButtonEl.addEventListener("click", handleAddIncome);

//add expense functionality
const handleAddExpense = async (e) => {
  e.stopPropagation();
  e.preventDefault();
  expenseLoaderEl.style.display = "block";
  const amount = Number(addTransactionForm.amount.value);
  const category = selectCategoryEl.value;
  const accountValue = selectAccountOptionEl.value;

  const amountErrorEl = document.getElementById("amount-error");
  const accountErrorEl = document.getElementById("account-error");
  const categoryErrorEl = document.getElementById("category-error");

  amountErrorEl.style.visibility = "hidden";
  accountErrorEl.style.visibility = "hidden";
  categoryErrorEl.style.visibility = "hidden";

  if (amount <= 0) {
    amountErrorEl.style.visibility = "visible";
    expenseLoaderEl.style.display = "none";
    return;
  }

  if (!accountValue) {
    accountErrorEl.style.visibility = "visible";
    expenseLoaderEl.style.display = "none";
    return;
  }

  if (!category) {
    categoryErrorEl.style.visibility = "visible";
    expenseLoaderEl.style.display = "none";
    return;
  }

  const accountsSnapshot = await db
    .collection("accounts")
    .doc(key)
    .collection("accounts")
    .get();
  const accountsData = accountsSnapshot.docs.map((doc) => doc.data());

  let updatedAccounts = [];
  let insufficientBalance = false;

  accountsData.forEach((accountData) => {
    const updatedAccount = accountData.accounts.find(
      (account) => account.id === accountValue
    );

    if (updatedAccount) {
      if (updatedAccount.amount >= amount) {
        updatedAccount.amount -= amount;
        updatedAccounts.push(...accountData.accounts);
      } else {
        insufficientBalance = true;
      }
    }
  });

  if (insufficientBalance) {
    expenseLoaderEl.style.display = "none";
    setTimeout(() => {
      alert("You have insufficient balance to make this transaction!");
    }, 100);
    return;
  }

  await db.collection("accounts").doc(key).collection("accounts").doc(key).set({
    accounts: updatedAccounts,
  });
  //disappear loader
  expenseLoaderEl.style.display = "none";

  const transaction = {
    category: category,
    accountType: accountValue,
    amount: amount,
    date: new Date().toDateString(),
  };

  const transactionsSnapshot = await db.collection("transactions").get();
  const transactionsData = transactionsSnapshot.docs
    .find((doc) => doc.id === key)
    .data();

  transactionsData.expenses.push(transaction);

  await db.collection("transactions").doc(key).set({
    expenses: transactionsData.expenses,
    incomes: transactionsData.incomes,
  });
  alert(
    `RS. ${amount.toFixed(
      2
    )} is deducted from account: ${accountValue} successfully!`
  );
  //call the function for updated accounts in table
  updateAccountTable();
  //clear all the inputs
  addTransactionForm.reset();
};
addExpenseButtonEl.addEventListener("click", handleAddExpense);
// Function to update the account table in real-time
const updateAccountTable = () => {
  const accountDocRef = db
    .collection("accounts")
    .doc(key)
    .collection("accounts")
    .doc(key);

  // Set up a Firestore listener to track changes in the account document
  accountDocRef.onSnapshot((doc) => {
    const accountData = doc.data();
    if (accountData) {
      const accounts = accountData.accounts;
      // Clear the existing table rows
      accountTable.querySelector("tbody").innerHTML = "";
      selectAccountOptionEl.innerHTML = "";
      // Iterate through the accounts and add rows to the table
      accounts.forEach((account) => {
        //code for accounts in table
        const row = document.createElement("tr");
        const nameCell = document.createElement("th");
        const amountCell = document.createElement("td");
        nameCell.classList.add(
          "px-6",
          "py-4",
          "font-bold",
          "text-gray-900",
          "whitespace-nowrap",
          "dark:text-white"
        );
        amountCell.classList.add("px-6", "py-4", "font-medium");
        nameCell.textContent = account.name;
        amountCell.textContent = `Rs.${account.amount.toFixed(2)}`;

        row.appendChild(nameCell);
        row.appendChild(amountCell);
        accountTable.classList.add(
          "w-full",
          "text-sm",
          "text-left",
          "text-gray-500",
          "dark:text-gray-400"
        );
        accountTable.querySelector("tbody").appendChild(row);

        //logic for rendering accounts in select option of add Transaction Form
        const newOption = document.createElement("option");
        const optionText = document.createTextNode(account.name);
        newOption.appendChild(optionText);
        newOption.value = account.id;
        selectAccountOptionEl.appendChild(newOption);
      });
    }
  });
  // gettingTotalIncomesAndExpenses();
};
selectCategory();
updateAccountTable();
//listens for every auth state change
accountsAccess(key);
auth.onAuthStateChanged((user) => {
  if (user) {
    setUpUI(user);
    console.log("user logged in", user);
    // accountsAccess(user.uid);
    selectCategory();
  } else {
    const html = `To use App, please Login`;
    userName.innerHTML = html;
    userName.style.visibility = "visible";
    console.log(userName);
  }
});
