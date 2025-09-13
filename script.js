import { 
    checkSystemTheme, 
    body, 
    resetInput,
    getFormValue,
    showNotification
} from "./scripts/utils.js";
import { 
    renderBudgetDetail, 
    renderBudgets,
    addNewBudget,
    closeModalBudget,
    showBudgetPage,
    openUpdateBudget,
    deleteBudget,
    updateBudget
} from "./scripts/budget.js";
import { 
    selectUrutan, 
    renderPengeluaran,
    openCreatePengeluaran,
    addPengeluaran,
    closeModalPengeluaran,
    deletePengeluaran,
    updatePengeluaran
} from "./scripts/spent.js";

const backHomeBtn = document.querySelector("#budget_details button.back_home");
const closeModalBudgetBtn = document.querySelector("#budget_form i");
const addSpentBtn = document.querySelector(".add_spent");
const closeModalSpentBtn = document.querySelector("#spent_form i");
const updateBudgetButton = document.querySelector("#budget_details .budget_card .icon_pencil");

checkSystemTheme();
renderBudgets();

//theme
document.getElementById("theme_switch").addEventListener("click", (e) => {
    if (body.classList.contains("dark")) {
        document.getElementById("light_theme").classList.remove("hidden");
        document.getElementById("dark_theme").classList.add("hidden");
    } else {
        document.getElementById("light_theme").classList.add("hidden");
        document.getElementById("dark_theme").classList.remove("hidden");
    }

    body.classList.toggle("dark");
});

//on click back home
backHomeBtn.addEventListener("click", () => {
    showBudgetPage();
});

//close modal
closeModalBudgetBtn.addEventListener("click", () => {
    closeModalBudget();
});

//on click update button
updateBudgetButton.addEventListener("click", () => {
    openUpdateBudget();
});

//on click delete budget
document.getElementById("delete_budget").addEventListener("click", () => {
    const budgetId = document.getElementById("budget_id").value;

    deleteBudget(budgetId);
});

//tambah pengeluaran
addSpentBtn.addEventListener("click", () => {
    openCreatePengeluaran();
});

//submit form pengeluaran
document.querySelector("#spent_form form").addEventListener("submit", (e) => {
    e.preventDefault();
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const data = getFormValue(new FormData(e.target));

    const pengeluaranId = document.getElementById("id_pengeluaran").value;

    if (pengeluaranId) {
        updatePengeluaran(pengeluaranId, data);
    } else {
        addPengeluaran(data);
    }

    closeModalPengeluaran();
    resetInput();
    showNotification(`✔️ Pengeluaran ${data.nama_pengeluaran} berhasil disimpan!`);
    const urutan = selectUrutan.value;
    renderPengeluaran(budgetId, urutan);
    renderBudgetDetail(budgetId);
});

//close form pengeluaran
closeModalSpentBtn.addEventListener("click", () => {
    closeModalPengeluaran();
});

//on change sort pengeluaran
document.getElementById("sort_pengeluaran").addEventListener("change", (e) => {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    renderPengeluaran(budgetId, e.target.value);
})

// on click delete pengeluaran
document.getElementById("delete_pengeluaran").addEventListener("click", () => {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const pengeluaranId = document.getElementById("id_pengeluaran").value;

    deletePengeluaran(budgetId, pengeluaranId);
});

//submit form budget
document.querySelector("#budget_form form").addEventListener("submit", (e) => {
    e.preventDefault();

    const data = getFormValue(new FormData(e.target));
    const idBudget = document.getElementById("budget_id").value;

    if (idBudget) {
        updateBudget(data, idBudget);
    } else {
        addNewBudget(data);
    }

    closeModalBudget();
    resetInput();
    showNotification(`✔️Budget ${data.nama_budget} berhasil disimpan!`);
    renderBudgets();
});