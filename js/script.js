const fileInput = document.querySelector('#pimg');
let base64String = "";
let data = JSON.parse(localStorage.getItem('crud')) || [];
const searchInput = document.querySelector('#pinput');

searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.trim();
    if (searchValue !== "") {
        const filteredData = data.filter(item => item.id == searchValue || item.name.includes(searchValue));
        renderProducts(filteredData);
    } else {

        renderProducts(data);
    }
});
function renderProducts(filteredData = data) {
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No product found</td></tr>';
        return;
    }
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML += `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td><img src ="${item.img}" height=50px></td>
            <td>${item.price}</td>
            <td>${item.disc}</td>
            <td>
                <button class="btn btn-primary" data-type="editdata" data-id="${item.id}">Edit</button>
                <button class="btn btn-primary" data-type="deldata" data-id="${item.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
renderProducts()
let idForUpadate = ""
function editProduct(id) {
    document.getElementById('form').dataset.form = "edit";
    let product = data.find(item => item.id == id);
    document.getElementById("btn1").dataset.type = "updateData"
    idForUpadate = id;
    document.getElementById('pname').value = product.name;
    document.getElementById('pprice').value = product.price;
    document.getElementById('ptext').value = product.disc;
    // base64String = product.img;
    let previewImg = document.querySelector('#pimg');
    previewImg.src = product.img;
    previewImg.style.display = 'block';
}
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        base64String = reader.result;
        console.log(base64String);
    };
    reader.readAsDataURL(file);
});
function toggleSort() {
    if (isAscending) {
        sortByIdDescending();
    } else {
        sortByIdAscending();
    }
    isAscending = !isAscending;
}
function sortByIdAscending() {
    data.sort((a, b) => a.id - b.id);
    renderProducts();
}
function sortByIdDescending() {
    data.sort((a, b) => b.id - a.id);
    renderProducts();
}
function toggleSortByName() {
    if (isAscending) {
        sortByNameDescending();
    } else {
        sortByNameAscending();
    }
    isAscending = !isAscending;
}
function sortByNameAscending() {
    data.sort((a, b) => a.name.localeCompare(b.name));
    renderProducts();
}
function sortByNameDescending() {
    data.sort((a, b) => b.name.localeCompare(a.name));
    renderProducts();
}
function toggleSortByPrice() {
    if (isAscending) {
        sortByPriceDescending();
    } else {
        sortByPriceAscending();
    }
    isAscending = !isAscending;
}
function sortByPriceAscending() {
    data.sort((a, b) => a.price - b.price);
    renderProducts();
}
function sortByPriceDescending() {
    data.sort((a, b) => b.price - a.price);
    renderProducts();
}
let isAscending = true;
document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
        switch (button.dataset.type) {
            case "editdata":
                const ProductID = button.dataset.id;
                console.log(ProductID);
                editProduct(ProductID);
                break;
            case "deldata":
                const productId = button.dataset.id;
                console.log(productId);
                deleteProduct(productId);
                break;
            case "sort":
                toggleSort();
                break;
            case "namesort":
                toggleSortByName();
                break;
            case "pricesort":
                toggleSortByPrice();
                break;
        }
    });
});

function deleteProduct(id) {
    const productIndex = data.findIndex(item => item.id == id);
    console.log(productIndex);
    if (productIndex !== -1) {
        data.splice(productIndex, 1);
        localStorage.setItem('crud', JSON.stringify(data));
        window.location.reload();
    }
}
function addData() {
    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;
    let disc = document.getElementById("ptext").value;
    let id = parseInt((data.length > 0) ? data[data.length - 1].id + 1 : 1);
    let data1 = {
        id,
        name,
        img: base64String,
        price,
        disc,
    }
    data.push(data1);
    console.log(data);
    localStorage.setItem('crud', JSON.stringify(data));
    renderProducts();
}
function editData() {
    debugger;
    const updatedName = document.getElementById("pname").value;
    const updatedImg = base64String || data.find(item => item.id === parseInt(idForUpadate)).img;
    const updatedPrice = document.getElementById("pprice").value;
    const updatedDesc = document.getElementById("ptext").value;
    const updatedProduct = {
        id: parseInt(idForUpadate),
        name: updatedName,
        price: updatedPrice,
        disc: updatedDesc,
        img: updatedImg,
    };
    const productIndex = data.findIndex(item => item.id == parseInt(idForUpadate));
    if (productIndex !== -1) {
        data[productIndex] = updatedProduct;
    }
    localStorage.setItem('crud', JSON.stringify(data));
    renderProducts();
}
let form = document.querySelector("#form")
form.addEventListener("submit", () => {
    console.log(form.dataset.form);
    (form.dataset.form == "add") ? addData() : editData()
})
