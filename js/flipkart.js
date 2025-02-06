const selectedCategory = JSON.parse(localStorage.getItem('category')) || [];;
const products = JSON.parse(localStorage.getItem('crud')) || [];
console.log(selectedCategory.name)
for (let i in selectedCategory) {
    let exists = 0;
    for (let j in products) {
        if (i.name == products[j]['category']) {
            let exists = 1
            if (exists) {
                const div = document.createElement('div');
                div.classList.add('container bg-light mt-3 p-2')
                div.innerHTML = `
            <div class="initial-items-list">
                <div class="row">
                    <div class="d-flex">
                         <div class="cards-wrapper">
                         </div>
                    </div>
                </div>
            </div>
                `
            }
        }
    }
}



let filteredProducts = [];

products.forEach((product) => {
    selectedCategory.forEach((scategory) => {
        if (product.category == scategory.name) {
            filteredProducts.push(product);
        }
    })
})



const productList = document.getElementById('accessories-section');


productList.innerHTML = '';

if (filteredProducts.length === 0) {
    productList.innerHTML = '<p>No products available in this category.</p>';
   
}


filteredProducts.forEach(product => {
    const col1 = document.createElement('div');
    col1.classList.add('row-ms-2')
    col1.innerHTML = `
        <h4>${product.category}</h4>
        `
    const col = document.createElement('div');
   
    col.classList.add('col-md-4');

    col.innerHTML = `
            <div class="card">
                <img src="${product.img}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                  
                    <p class="card-text">$${product.price}</p>
                    
                </div>
            </div>
        `;
    productList.appendChild(col1);
    productList.appendChild(col);


});


