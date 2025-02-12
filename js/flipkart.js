const selectedCategory = JSON.parse(localStorage.getItem('category')) || [];
const products = JSON.parse(localStorage.getItem('crud')) || [];
const productList = document.getElementById('accessories-section');
productList.innerHTML = '';
let rowsCategory = {};
let filteredProducts = [];
products.forEach((product) => {
    selectedCategory.forEach((scategory) => {
        if (product.category == scategory.name) {
            filteredProducts.push(product);
        }
    });
});
if (filteredProducts.length === 0) {
    productList.innerHTML = '<p>No products available in this category.</p>';
}
filteredProducts.forEach(product => {
    if (!rowsCategory[product.category]) {
        const container = document.createElement('div');
        container.classList.add('container', 'bg-light', 'mt-3', 'p-2');

        const categoryHeading = document.createElement('h4');
        categoryHeading.textContent = product.category;
        container.appendChild(categoryHeading);

        const categoryRow = document.createElement('div');
        categoryRow.classList.add('row', 'g-3');
        categoryRow.setAttribute('id', `row-${product.category}`);

        container.appendChild(categoryRow);
        productList.appendChild(container);

        rowsCategory[product.category] = categoryRow;
    }
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'd-flex');

    col.innerHTML = `
        <div class="card w-100">
            <img src="${product.img}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title text-center">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
            </div>
        </div>
    `;
    rowsCategory[product.category].appendChild(col);
});
