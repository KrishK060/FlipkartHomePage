const fileInput = document.querySelector('#pimg');
let base64String = "";
let data = JSON.parse(localStorage.getItem('crud')) || [];
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
        deleteProductOnFlipkart(id);
        window.location.reload();
    }
}

function addData() {
    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;
    let disc = document.getElementById("ptext").value;
    let category = document.getElementById("category").value; // Get selected category
    let id = parseInt((data.length > 0) ? data[data.length - 1].id + 1 : 1);

    let data1 = {
        id,
        name,
        img: base64String,
        price,
        disc,
        category, // Add category to product data
    };

    data.push(data1);
    localStorage.setItem('crud', JSON.stringify(data)); // Save updated data
    updateFlipkartHomepage(data1); // Sync with Flipkart page
    renderProducts();
}

function editData() {
    const updatedName = document.getElementById("pname").value;
    const updatedImg = base64String || data.find(item => item.id === parseInt(idForUpadate)).img;
    const updatedPrice = document.getElementById("pprice").value;
    const updatedDesc = document.getElementById("ptext").value;
    const updatedCategory = document.getElementById("category").value;

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
    updateFlipkartHomepage(updatedProduct); // Sync with Flipkart page
    renderProducts();
}

let form = document.querySelector("#form");
form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log(form.dataset.form);
    if (form.dataset.form == "add") {
        addData();
    } else {
        editData();
    }
});

function updateFlipkartHomepage(product) {
    let flipkartData = JSON.parse(localStorage.getItem('crud')) || [];
    const existingIndex = flipkartData.findIndex(item => item.id == product.id);

    if (existingIndex !== -1) {
        flipkartData[existingIndex] = product;
    } else {
        flipkartData.push(product);
    }

    localStorage.setItem('crud', JSON.stringify(flipkartData));
    renderFlipkartHomepage();
}
function renderFlipkartHomepage() {
    const jewelrySection = document.getElementById('jewelry-products');
    const accessoriesSection = document.getElementById('accessories-products');

    if (!jewelrySection || !accessoriesSection) return;

    jewelrySection.innerHTML = '';
    accessoriesSection.innerHTML = '';

    let flipkartData = JSON.parse(localStorage.getItem('crud')) || [];

    flipkartData.forEach(product => {
        const productCard = createProductCard(product);
        if (product.category === 'jewelry') {
            jewelrySection.appendChild(productCard);
        } else if (product.category === 'accessories') {
            accessoriesSection.appendChild(productCard);
        }
    });
}


function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('col-md-4', 'mb-4');
    card.innerHTML = `
        <div class="card">
            <img src="${product.img}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.disc}</p>
                <p class="card-text"><strong>Price:</strong> $${product.price}</p>
                <button class="btn btn-primary" onclick="editProductOnFlipkart(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProductOnFlipkart(${product.id})">Delete</button>
            </div>
        </div>
    `;
    return card;
}

function deleteProductOnFlipkart(id) {
    let flipkartData = JSON.parse(localStorage.getItem('crud')) || [];
    flipkartData = flipkartData.filter(item => item.id != id);
    localStorage.setItem('crud', JSON.stringify(flipkartData));
    renderFlipkartHomepage();
}

function editProductOnFlipkart(id) {
    alert(`Editing product: ${id}`);
}

// Ensure Flipkart page updates on load
document.addEventListener("DOMContentLoaded", renderFlipkartHomepage);