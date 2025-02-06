
function loadProducts() {
// debugger;

    const selectedCategory = JSON.parse(localStorage.getItem('category')) || [];; 
    const products = JSON.parse(localStorage.getItem('crud')) || [];

    console.log(selectedCategory);
    console.log(products);

    let filteredProducts = [];

    products.forEach((product) => {
        selectedCategory.forEach((scategory) => {
        if(product.category == scategory.name){
                filteredProducts.push(product);
            }
        })
    })

    console.log(filteredProducts);
    
    const productList = document.getElementById('accessories-section');
    
   
    productList.innerHTML = '';

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p>No products available in this category.</p>';
        return;
    }

  
    filteredProducts.forEach(product => {
        const col1=document.createElement('div');
        col1.classList.add('row-ms-2')
        col1.innerHTML=`
        <h4>${product.category}</h4>
        `
        const col = document.createElement('div');
        console.log(product)
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
}

loadProducts();