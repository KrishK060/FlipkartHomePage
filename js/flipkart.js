const selectedCategory = JSON.parse(localStorage.getItem('category')) || [];
const products = JSON.parse(localStorage.getItem('crud')) || [];

const productList = document.getElementById('accessories-section');
productList.innerHTML = '';


let categoryRows = {};

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
    
    if (!categoryRows[product.category]) {
    
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('container', 'bg-light', 'mt-3', 'p-2');


        const categoryHeading = document.createElement('h4');
        categoryHeading.textContent = product.category;
        categoryContainer.appendChild(categoryHeading);

    
        const categoryRow = document.createElement('div');
        categoryRow.classList.add('row', 'g-3'); 
        categoryRow.setAttribute('id', `row-${product.category}`);

        categoryContainer.appendChild(categoryRow);
        productList.appendChild(categoryContainer);

        
        categoryRows[product.category] = categoryRow;
    }

    
    const col = document.createElement('div');
    col.classList.add('col-md-4', 'd-flex'); 

    col.innerHTML = `
        <div class="card w-100">
            <img src="${product.img}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">$${product.price}</p>
            </div>
        </div>
    `;

    
    categoryRows[product.category].appendChild(col);
});
