const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(process.mainModule.filename), "data", "cart.json");

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) =>{
            let cart = {products: [1,2,3], totolPrice: 0};
            console.log("@"+fileContent);
            cart = fileContent;
            console.log(cart.products);
            
            if(!err){
                cart = JSON.parse(fileContent);
            }
            
            // Analyze the cart => Find existing product
            console.log(cart.products);
            
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            console.log("existingProduct = "+ existingProduct);
            
            let updatedProduct;
            // Add  new product / increase quantity
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }else{
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totolPrice = cart.totolPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
                
            });
        });
    }
    
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return;
            } 
            const updatedCart = {...JSON.parse(fileContent)};
            const product = updatedCart.products.findIndex(prod => prod.id ===id );
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totolPrice = updatedCart.totolPrice - productPrice * productQty;
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);   
            });

        });
        
    }

    static getProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        })
    }
    
}