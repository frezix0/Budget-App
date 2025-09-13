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
const updateBudgetButton = document.querySelector("#budget_details .budget_card .icon_pencil");

const body = document.getElementsByTagName("body")[0];
checkSystemTheme();

function checkSystemTheme() {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (darkTheme.matches) {
        body.classList.add("dark");
        document.getElementById("light_theme").classList.add("hidden");
        document.getElementById("dark_theme").classList.remove("hidden");
    }
}

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

const selectUrutan = document.getElementById("sort_pengeluaran");

document.getElementById("delete_budget").addEventListener("click", () => {
    const budgetId = document.getElementById("budget_id").value;

    deleteBudget(budgetId);
});

document.getElementById("delete_pengeluaran").addEventListener("click", () => {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    const pengeluaranId = document.getElementById("id_pengeluaran").value;

    deletePengeluaran(budgetId, pengeluaranId);
});
updateBudgetButton.addEventListener("click", () => {
    openUpdateBudget();
});

function selectBudgetCardsandButton() {
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

function renderBudgets() {
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

document.getElementById("sort_pengeluaran").addEventListener("change", (e) => {
    const budgetId = document
        .querySelector("#budget_details .budget_card")
        .getAttribute("data-budgetid");

    renderPengeluaran(budgetId, e.target.value);
})

function renderPengeluaran(budgetId, sortBy) {
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

function renderBudgetDetail(budgetId) {
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
backHomeBtn.addEventListener("click", () => {
    showBudgetPage();
});

function showBudgetPage() {
    budgetDetailPage.classList.add("hidden");
    budgetPage.classList.remove("hidden");
    renderBudgets();
}

function openModalBudget() {
    budgetForm.classList.remove("hidden");
}

function closeModalBudget() {
    budgetForm.classList.add("hidden");
}

function openCreateBudget() {
    document.querySelector("#budget_form h4").innerText = "Tambah Budget";
    document.querySelector("#budget_form button.danger").classList.add("hidden");
    resetInput();
    openModalBudget();
}

function openUpdateBudget() {
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

closeModalBudgetBtn.addEventListener("click", () => {
    closeModalBudget();
});

addSpentBtn.addEventListener("click", () => {
    openCreatePengeluaran();
});

closeModalSpentBtn.addEventListener("click", () => {
    closeModalPengeluaran();
});

function openCreatePengeluaran() {
    document.querySelector("#spent_form h4").innerText = "Tambah Pengeluaran";
    document.getElementById("delete_pengeluaran").classList.add("hidden");
    resetInput();
    openModalPengeluaran();
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

function openModalPengeluaran() {
    spentForm.classList.remove("hidden");
}

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

function addNewBudget(newData) {
    const dataWithId = {
        id: generateId(),
        ...newData,
    };

    const existingData = getExistingData();

    existingData.push(dataWithId);

    saveBudget(existingData);
}

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

function updateBudget(newData, budgetId) {
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

function deleteBudget(budgetId) {
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

function addPengeluaran(data) {
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

function updatePengeluaran(pengeluaranId, data) {
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

function deletePengeluaran(budgetId, pengeluaranId) {
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

function hitungSisaBudget(dataBudget) {
    const totalPengeluaran = dataBudget.pengeluaran
        ?.map((item) => +item.jumlah)
        .reduce((jumlah, total) => jumlah + total, 0) ?? 0;

    return +dataBudget.total - totalPengeluaran;
}

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(angka)
}

function saveBudget(budgets) {
    localStorage.setItem("budgets", JSON.stringify(budgets));
}