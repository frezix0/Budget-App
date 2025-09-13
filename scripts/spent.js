import { getBudgetById, saveBudget, renderBudgetDetail } from "./budget.js";
import { formatRupiah, resetInput, generateId, getExistingData, showNotification } from "./utils.js";

export const selectUrutan = document.getElementById("sort_pengeluaran");
const spentForm = document.getElementById("spent_form");
export function renderPengeluaran(budgetId, sortBy) {
    const { pengeluaran } = getBudgetById(budgetId);

    const [index, type] = sortBy?.split("|");

    sortPengeluaran(pengeluaran, index, type);

    const listPengeluaran = pengeluaran?.map((item) => {
        return `<div class="spent_item" data-pengeluaranid="${item.id}">
                <div class="spent_item_description">
                    <h4>${item.nama_pengeluaran}</h4>
                    <p>${item.tanggal}</p>
                </div>
                <div class="spent_item_price">
                    <p>${formatRupiah(item.jumlah)}</p>
                </div>
            </div>`;
    })
        .join("") ?? null;

    document.querySelector("#budget_details .spent").innerHTML = listPengeluaran;

    document.querySelectorAll("#budget_details .spent .spent_item").forEach((elemen) => {
        elemen.addEventListener("click", () => {
            openUpdatePengeluaran(elemen.getAttribute("data-pengeluaranid"), pengeluaran);
        });
    });
}

function sortPengeluaran(pengeluaran, indexData, type) {
    if (!pengeluaran) {
        return [];
    }
    let perubahan = 0;

    do {
        perubahan = 0;
        for (let i = 0; i < pengeluaran.length - 1; i++) {
            const leftData = indexData == "jumlah" ? +pengeluaran[i][indexData] : pengeluaran[i][indexData];
            const rightData = indexData == "jumlah" ? +pengeluaran[i + 1][indexData] : pengeluaran[i + 1][indexData]
            if (
                (type == "asc" &&
                    leftData > rightData) ||
                (type == "dsc" &&
                    leftData < rightData)
            ) {
                let temp = pengeluaran[i];
                pengeluaran[i] = pengeluaran[i + 1];
                pengeluaran[i + 1] = temp;
                perubahan++;
            }
        }
    } while (perubahan > 0);

    return pengeluaran;
}

function openModalPengeluaran() {
    spentForm.classList.remove("hidden");
}

export function closeModalPengeluaran() {
    spentForm.classList.add("hidden");
}

export function openCreatePengeluaran() {
    document.querySelector("#spent_form h4").innerText = "Tambah Pengeluaran";
    document.getElementById("delete_pengeluaran").classList.add("hidden");
    resetInput();
    openModalPengeluaran();
}

export function addPengeluaran(data) {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const currentBudget = getBudgetById(budgetId);
    const currentSpent = currentBudget.pengeluaran ?? [];

    const budgetWithSpent = {
        ...currentBudget,
        pengeluaran: [...currentSpent, { ...data, id: generateId() }]
    };

    const allBudgets = getExistingData();
    const updatedBudgets = allBudgets.map((budget) => {
        if (budget.id == budgetId) {
            return budgetWithSpent;
        }
        return budget;
    });
    saveBudget(updatedBudgets);
}

function openUpdatePengeluaran(pengeluaranId, pengeluaran) {
    document.querySelector("#spent_form h4").innerText = "Update Pengeluaran";
    document.getElementById("delete_pengeluaran").classList.remove("hidden");
    const currentPengeluaran = pengeluaran?.filter(
        (item) => item.id == pengeluaranId
    )[0];

    //set nama pengeluaran
    document.getElementById("nama_pengeluaran").value = currentPengeluaran.nama_pengeluaran;

    //set jumlah pengeluaran
    document.getElementById("jumlah_pengeluaran").value = currentPengeluaran.jumlah;

    //set tanggal
    document.getElementById("tanggal_pengeluaran").value = currentPengeluaran.tanggal;

    //set id
    document.getElementById("id_pengeluaran").value = currentPengeluaran.id;
    openModalPengeluaran();
}

export function updatePengeluaran(pengeluaranId, data) {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const allBudgets = getExistingData();

    const updatedBudget = allBudgets?.map((budget) => {
        if (budget.id == budgetId) {

            const pengeluaran = budget?.pengeluaran?.map((item) => {
                if (item.id == pengeluaranId) {
                    return { ...data, id: item.id };
                }
                return item;
            });
            return {
                ...budget,
                pengeluaran,
            };

        }
        return budget;
    });

    saveBudget(updatedBudget);
    const urutan = selectUrutan.value;
    renderBudgetDetail(budgetId);
    renderPengeluaran(budgetId, urutan);
}

export function deletePengeluaran(budgetId, pengeluaranId) {
    const allBudgets = getExistingData();
    const confirmed = confirm("Apakah ingin menghapus pengeluaran ini?");

    if (confirmed) {
        const afterDelete = allBudgets.map((budget) => {
            if (budget.id == budgetId) {
                return {
                    ...budget,
                    pengeluaran: budget.pengeluaran.filter(
                        (pengeluaran) => pengeluaran.id != pengeluaranId
                    ),
                };
            }
            return budget;
        });

        saveBudget(afterDelete);
        closeModalPengeluaran();
        const urutan = selectUrutan.value;
        renderPengeluaran(budgetId, urutan);
        showNotification("✔️ Pengeluaran berhasil dihapus!");
    }

    closeModalPengeluaran();
}