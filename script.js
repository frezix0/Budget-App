const backHomeBtn = document.querySelector("#budget_details button.back_home");
const budgetPage = document.getElementById("budgets");
renderBudgets();
const budgetDetailPage = document.querySelector("#budget_details");
const budgetForm = document.getElementById("budget_form");
const closeModalBudgetBtn = document.querySelector("#budget_form i");
const addSpentBtn = document.querySelector(".add_spent");
const spentForm = document.getElementById("spent_form");
const closeModalSpentBtn = document.querySelector("#spent_form i");
const notification = document.getElementById("notification");


function selectBudgetCardsandButton() {
    const budgetCards = document.querySelectorAll("#budgets .budget_card");
    const addBudgetButton = document.querySelector("#budgets button");

    //event listener klik budget card
    budgetCards.forEach((card) => {
        card.addEventListener("click", () => {
            const budgetId = card.getAttribute("data-budgetid");
            renderBudgetDetail(budgetId);
            budgetPage.classList.add("hidden");
            budgetDetailPage.classList.remove("hidden");
        });
    });

    //event listener klik tambah budget
    addBudgetButton.addEventListener("click", () => {
        budgetForm.classList.remove("hidden");
    });
}

function renderBudgets() {
    const budgetData = getExistingData();
    const budgetList = budgetData.map((budget) => {
        return `<div class="budget_card" data-budgetid="${budget.id}">
                <h2 class="budget_name">${budget.nama_budget}</h2>
                <p class="budget_amount">Rp ${budget.total}</p>
                <p class="budget_total"> Total Rp ${budget.total}</p>
            </div>`;
    })
        .concat([`<button class="add_budget">+</button>`])
        .join("");

    budgetPage.innerHTML = budgetList;
    selectBudgetCardsandButton();
}

function renderBudgetDetail(budgetId) {
    const currentBudget = getBudgetById(budgetId);

    document.querySelector("#budget_details .budget_card")
        .setAttribute("data-budgetid", budgetId);
    document.querySelector("#budget_details .budget_card h2").innerText =
        currentBudget.nama_budget;

    document.querySelector("#budget_details .budget_card .budget_amount").innerText =
        "Rp " + currentBudget.total;

    document.querySelector("#budget_details .budget_card .budget_total").innerText =
        "Total Rp " + currentBudget.total;

}
backHomeBtn.addEventListener("click", () => {
    budgetDetailPage.classList.add("hidden");
    budgetPage.classList.remove("hidden");
});

function closeModalBudget() {
    budgetForm.classList.add("hidden");
}

closeModalBudgetBtn.addEventListener("click", () => {
    closeModalBudget();
});

addSpentBtn.addEventListener("click", () => {
    spentForm.classList.remove("hidden");
});

closeModalSpentBtn.addEventListener("click", () => {
    closeModalPengeluaran();
});

function closeModalPengeluaran() {
    spentForm.classList.add("hidden");
}

function getFormValue(formData) {
    let result = new Object();

    for (const data of formData.entries()) {
        const [key, value] = data;

        Object.assign(result, {
            [key]: value,
        });
    }

    return result;
}

function getExistingData() {
    return JSON.parse(localStorage.getItem("budgets")) ?? [];
}

function getBudgetById(id) {
    const budgets = getExistingData();
    return budgets.filter((budget) => budget.id == id)[0];
}
function saveDataBudget(newData) {
    const existingData = getExistingData();

    existingData.push(newData);

    localStorage.setItem("budgets", JSON.stringify(existingData));
}

//submit form budget
document.querySelector("#budget_form form").addEventListener("submit", (e) => {
    e.preventDefault();

    const data = getFormValue(new FormData(e.target));

    const dataWithId = {
        id: generateId(),
        ...data,
    }
    saveDataBudget(dataWithId);
    closeModalBudget();
    resetInput();
    showNotification(`✔️Budget ${data.nama_budget} berhasil disimpan!`);
    renderBudgets();
});

//submit form pengeluaran
document.querySelector("#spent_form form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = getFormValue(new FormData(e.target));

    addPengeluaran (data);
    closeModalPengeluaran();
    resetInput();
    showNotification(`✔️ Pengeluaran ${data.nama_pengeluaran} berhasil ditambahkan!`);
});

function addPengeluaran(data) {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const currentBudget = getBudgetById(budgetId);
    const currentSpent = currentBudget.pengeluaran ?? [];

    const budgetWithSpent = {
        ...currentBudget,
        pengeluaran: [...currentSpent, data]
    };

    const allBudgets = getExistingData();
    const updatedBudgets = allBudgets.map((budget) => {
        if (budget.id == budgetId) {
            return budgetWithSpent
        } else {
            return budget
        }
    });
    localStorage.setItem("budgets", JSON.stringify(updatedBudgets));
}

function generateId() {
    return new Date().getTime();
}

function resetInput() {
    document.querySelectorAll("form input").forEach((input) => {
        input.value = "";
    });
}

function showNotification(message) {
    const newNotification = document.createElement("div");
    newNotification.innerText = message;
    newNotification.classList.add("notification");

    notification.appendChild(newNotification);

    setTimeout(() => {
        newNotification.classList.add("out");

        setTimeout(() => {
            notification.removeChild(newNotification);
        }, 500);
    }, 4000)
}