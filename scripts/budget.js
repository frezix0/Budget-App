import { getExistingData, formatRupiah, resetInput, generateId, showNotification} from "./utils.js";
import { selectUrutan, renderPengeluaran } from "./spent.js";

export const budgetDetailPage = document.querySelector("#budget_details");
export const budgetPage = document.getElementById("budgets");
const budgetForm = document.getElementById("budget_form");

export function showBudgetPage() {
    budgetDetailPage.classList.add("hidden");
    budgetPage.classList.remove("hidden");
    renderBudgets();
}

export function renderBudgets() {
    const budgetData = getExistingData();
    const budgetList = budgetData.map((budget) => {

        const sisaBudget = hitungSisaBudget(budget);

        return `<div class="budget_card" data-budgetid="${budget.id}">
                <h2 class="budget_name">${budget.nama_budget}</h2>
                <p class="budget_amount">${formatRupiah(sisaBudget)}</p>
                <p class="budget_total"> Total ${formatRupiah(budget.total)}</p>
            </div>`;
    })
        .concat([`<button class="add_budget">+</button>`])
        .join("");

    budgetPage.innerHTML = budgetList;
    selectBudgetCardsandButton();
}

export function selectBudgetCardsandButton() {
    const budgetCards = document.querySelectorAll("#budgets .budget_card");
    const addBudgetButton = document.querySelector("#budgets button");

    //event listener klik budget card
    budgetCards.forEach((card) => {
        card.addEventListener("click", () => {
            const budgetId = card.getAttribute("data-budgetid");

            renderBudgetDetail(budgetId);
            const urutan = selectUrutan.value;
            renderPengeluaran(budgetId, urutan);
            budgetPage.classList.add("hidden");
            budgetDetailPage.classList.remove("hidden");
        });
    });

    //event listener klik tambah budget
    addBudgetButton.addEventListener("click", () => {
        openCreateBudget();
    });
}

function openModalBudget() {
    budgetForm.classList.remove("hidden");
}

export function closeModalBudget() {
    budgetForm.classList.add("hidden");
}

function openCreateBudget() {
    document.querySelector("#budget_form h4").innerText = "Tambah Budget";
    document.querySelector("#budget_form button.danger").classList.add("hidden");
    resetInput();
    openModalBudget();
}

export function addNewBudget(newData) {
    const dataWithId = {
        id: generateId(),
        ...newData,
    };

    const existingData = getExistingData();

    existingData.push(dataWithId);

    saveBudget(existingData);
}

export function getBudgetById(id) {
    const budgets = getExistingData();
    return budgets.filter((budget) => budget.id == id)[0];
}

export function saveBudget(budgets) {
    localStorage.setItem("budgets", JSON.stringify(budgets));
}

export function renderBudgetDetail(budgetId) {
    const currentBudget = getBudgetById(budgetId);
    const sisaBudget = hitungSisaBudget(currentBudget);
    document.querySelector("#budget_details .budget_card")
        .setAttribute("data-budgetid", budgetId);
    document.querySelector("#budget_details .budget_card h2").innerText =
        currentBudget.nama_budget;

    document.querySelector("#budget_details .budget_card .budget_amount").innerText =
        formatRupiah(sisaBudget);

    document.querySelector("#budget_details .budget_card .budget_total").innerText =
        "Total " + formatRupiah(currentBudget.total);

}

export function hitungSisaBudget(dataBudget) {
    const totalPengeluaran = dataBudget.pengeluaran
        ?.map((item) => +item.jumlah)
        .reduce((jumlah, total) => jumlah + total, 0) ?? 0;

    return +dataBudget.total - totalPengeluaran;
}

export function openUpdateBudget() {
    document.querySelector("#budget_form h4").innerText = "Update Budget";
    document.querySelector("#budget_form button.danger").classList.remove("hidden");

    const budgetId = document.querySelector("#budget_details .budget_card").getAttribute("data-budgetid");
    const currentBudget = getBudgetById(budgetId);

    //nama budget
    document.getElementById("nama_budget").value = currentBudget.nama_budget;

    //set total
    document.getElementById("total_budget").value = currentBudget.total;

    // set id
    document.getElementById("budget_id").value = currentBudget.id;
    openModalBudget();
}

export function updateBudget(newData, budgetId) {
    const existingData = getExistingData();
    const updatedBudget = existingData?.map((budget) => {
        if (budget.id == budgetId) {
            return { id: budgetId, ...newData, pengeluaran: budget.pengeluaran };
        }

        return budget;
    });

    saveBudget(updatedBudget);
    renderBudgetDetail(budgetId);
}

export function deleteBudget(budgetId) {
    const allBudgets = getExistingData();

    const confirmed = confirm("Apakah ingin menghapus budget ini?");

    if (confirmed) {
        const deletedBudgets = allBudgets.filter((budget) => budget.id != budgetId);

        saveBudget(deletedBudgets);

        showNotification(`✔️ Budget berhasil dihapus!`);
        closeModalBudget();
        showBudgetPage();
    } else {
        closeModalBudget();
    }
}