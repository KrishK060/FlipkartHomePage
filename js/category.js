let category = JSON.parse(localStorage.getItem('category')) || [];
let idForUpadate = "";
const searchInput = document.querySelector('#cinput');
searchInput.addEventListener('input', function () {
    const searchValue = searchInput.value.trim();
    if (searchValue !== "") {
        const filteredData = category.filter(item => item.id == searchValue || item.name.includes(searchValue));
        renderProducts(filteredData);
    } else {
        renderProducts(data);
    }
});
function renderProducts(filteredData = category) {
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';
    if (filteredData.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.classList.add('text-center');
        cell.innerHTML = 'No product found';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }
    filteredData.forEach(item => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        idCell.innerHTML = item.id;
        const nameCell = document.createElement('td');
        nameCell.innerHTML = item.name;
        const actionCell = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.classList.add('btn', 'btn-primary');
        editBtn.setAttribute('data-type', 'editdata');
        editBtn.setAttribute('data-id', item.id);
        editBtn.innerHTML = 'Edit';
        editBtn.addEventListener('click', () => editProduct(item.id));
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-primary');
        deleteBtn.setAttribute('data-type', 'deldata');
        deleteBtn.setAttribute('data-id', item.id);
        deleteBtn.innerHTML = 'Delete';
        deleteBtn.addEventListener('click', () => deleteProduct(item.id));
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}
renderProducts();

function editProduct(id) {
    document.getElementById('form').dataset.form = "edit";
    let product = category.find(item => item.id == id);
    idForUpadate = id;
    document.getElementById('cname').value = product.name;
}

let isAscending = true;
document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
        switch (button.dataset.type) {
            case "editdata":
                const ProductID = button.dataset.id;
                editProduct(ProductID);
                break;
            case "deldata":
                const productId = button.dataset.id;
                deleteProduct(productId);
                break;
        }
    });
});

function deleteProduct(id) {
    const productIndex = category.findIndex(item => item.id == id);
    if (productIndex !== -1) {
        category.splice(productIndex, 1);
        localStorage.setItem('category', JSON.stringify(category));
        renderProducts();
    }
}

function addData() {
    let name = document.getElementById("cname").value;
    let id = parseInt((category.length > 0) ? category[category.length - 1].id + 1 : 1);
    let data1 = {
        id,
        name,
    };
    category.push(data1);
    localStorage.setItem('category', JSON.stringify(category));
    renderProducts();
}

function editData() {
    const updatedName = document.getElementById("cname").value;
    const updatedProduct = {
        id: parseInt(idForUpadate),
        name: updatedName,
    };
    const productIndex = category.findIndex(item => item.id == parseInt(idForUpadate));
    if (productIndex !== -1) {
        category[productIndex] = updatedProduct;
    }
    localStorage.setItem('category', JSON.stringify(category));
    renderProducts();
}

let form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.dataset.form == "add") {
        addData();
    } else {
        editData();
    }
         document.getElementById("cname").value = ""
         form.dataset.form = "add" 
});
