const fileInput = document.querySelector('#pimg');
let base64String = "";
let data = JSON.parse(localStorage.getItem('crud')) || [];
let category = JSON.parse(localStorage.getItem('category')) || [];
const searchInput = document.querySelector('#pinput');
let idForUpadate = "";

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

        const imgCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = item.img;
        image.height = 50;
        imgCell.appendChild(image);

        const priceCell = document.createElement('td');
        priceCell.innerHTML = item.price;

        const descriptionCell = document.createElement('td');
        descriptionCell.innerHTML = item.disc;

        const categorycell = document.createElement('td')
        categorycell.innerHTML = item.category;

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
        row.appendChild(imgCell);
        row.appendChild(priceCell);
        row.appendChild(descriptionCell);
        row.appendChild(actionCell);
        row.appendChild(categorycell);

        tbody.appendChild(row);
    });
}
renderProducts();

function editProduct(id) {
    document.getElementById('form').dataset.form = "edit";
    let product = data.find(item => item.id == id);
    idForUpadate = id;
    document.getElementById('pname').value = product.name;
    document.getElementById('pprice').value = product.price;
    document.getElementById('ptext').value = product.disc;
    document.getElementById('selectCategory').value = product.category;
    let previewImg = document.querySelector('#pimg');
    previewImg.src = product.img;
    previewImg.style.display = 'block';
}

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        base64String = reader.result;

    };
    reader.readAsDataURL(file);
});

function toggleSort(field) {
    const ascending = isAscending;
    const idSortIcon = document.getElementById('id-sort');
    const nameSortIcon = document.getElementById('name-sort');
    const priceSortIcon = document.getElementById('price-sort');
    data.sort((a, b) => {
        if (field === 'name') {
            return ascending
                ? a[field].localeCompare(b[field])
                : b[field].localeCompare(a[field]);
        } else if (field === 'price') {
            return ascending
                ? parseFloat(a[field]) - parseFloat(b[field])
                : parseFloat(b[field]) - parseFloat(a[field]);
        } else {
            return ascending
                ? a[field] - b[field]
                : b[field] - a[field];
        }
    });
    isAscending = !isAscending;
    if (field === 'id') {
        if (isAscending) {
            idSortIcon.classList.remove("fa-sort-up");
            idSortIcon.classList.add("fa-sort-down");
        }
        else {
            idSortIcon.classList.remove("fa-sort");
            idSortIcon.classList.add("fa-sort-up");
        }
    }
    else if (field === 'name') {
        if (isAscending) {
            nameSortIcon.classList.remove("fa-sort-up");
            nameSortIcon.classList.add("fa-sort-down");
        } else {
            nameSortIcon.classList.remove("fa-sort");
            nameSortIcon.classList.add("fa-sort-up");
        }
    }
    else if (field === 'price') {
        if (isAscending) {
            priceSortIcon.classList.remove("fa-sort-up");
            priceSortIcon.classList.add("fa-sort-down");
        } else {
            priceSortIcon.classList.remove("fa-sort");
            priceSortIcon.classList.add("fa-sort-up");
        }
    }
    renderProducts();
}
for (let i = 0; i < category.length; i++) {
    selectCategory.innerHTML += ` <option value="${category[i]['name']}">${category[i]['name']}</option>`;
    selectCategory.dataset.val = i;
}

let isAscending = true;
document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
        switch (button.dataset.type) {
            case "editdata":
                const ProductID = button.dataset.id;
                document.getElementById("btn1").innerHTML = `edit`;
                editProduct(ProductID);
                break;
            case "deldata":
                const productId = button.dataset.id;
                deleteProduct(productId);
                break;
            case "sort":
                toggleSort('id');
                break;
            case "namesort":
                toggleSort('name');
                break;
            case "pricesort":
                toggleSort('price');
                break;
        }
    });
});

function deleteProduct(id) {
    const productIndex = data.findIndex(item => item.id == id);
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
    let category = document.getElementById("selectCategory").value;
    let id = parseInt((data.length > 0) ? data[data.length - 1].id + 1 : 1);
    let data1 = {
        id,
        name,
        img: base64String,
        price,
        disc,
        category,
    };
    data.push(data1);
    localStorage.setItem('crud', JSON.stringify(data));
    renderProducts();
}

function editData() {
    const updatedName = document.getElementById("pname").value;
    const updatedImg = base64String || data.find(item => item.id === parseInt(idForUpadate)).img;
    const updatedPrice = document.getElementById("pprice").value;
    const updatedDesc = document.getElementById("ptext").value;
    const updatedCategory = document.getElementById("selectCategory").value;

    const updatedProduct = {
        id: parseInt(idForUpadate),
        name: updatedName,
        price: updatedPrice,
        disc: updatedDesc,
        img: updatedImg,
        category: updatedCategory
    };

    const productIndex = data.findIndex(item => item.id == parseInt(idForUpadate));
    if (productIndex !== -1) {
        data[productIndex] = updatedProduct;
    }
    localStorage.setItem('crud', JSON.stringify(data));
    document.getElementById("btn1").innerHTML = `Submit`;
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
     document.getElementById("pname").value = ""
     document.getElementById("pprice").value = ""
     document.getElementById("ptext").value = ""
     form.dataset.form = "add" 
     
});









