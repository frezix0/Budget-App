export const body = document.getElementsByTagName("body")[0];

export function checkSystemTheme() {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");

    if (darkTheme.matches) {
        body.classList.add("dark");
        document.getElementById("light_theme").classList.add("hidden");
        document.getElementById("dark_theme").classList.remove("hidden");
    }
}

export function getExistingData() {
    return JSON.parse(localStorage.getItem("budgets")) ?? [];
}

export function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(angka)
}

export function resetInput() {
    document.querySelectorAll("form input").forEach((input) => {
        input.value = "";
    });
}

export function getFormValue(formData) {
    let result = new Object();

    for (const data of formData.entries()) {
        const [key, value] = data;

        Object.assign(result, {
            [key]: value,
        });
    }

    return result;
}

export function generateId() {
    return new Date().getTime();
}

export function showNotification(message) {
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