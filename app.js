// Harus ada Dependensi Terinstal: npm install express body-parser
// Running API, ketik pada terminal node app.js
// Jika berhasil muncul info "Server is running on port 3000"
// Bisa dicoba masing-masing Endpoint-nya melalui Postman


const express = require('express');
const bodyParser = require('body-parser');

class VendingMachine {
    constructor() {
        // Inisialisasi daftar harga dan stok item dalam mesin vending.
        this.itemPrices = {
            "Biskuit": 6000,
            "Chips": 8000,
            "Oreo": 10000,
            "Tango": 12000,
            "Cokelat": 15000
        };
        this.itemStocks = {
            "Biskuit": 5,
            "Chips": 5,
            "Oreo": 5,
            "Tango": 5,
            "Cokelat": 5
        };
        this.acceptedCoins = [2000, 5000, 10000, 20000, 50000];
    }

    // Fungsi untuk melakukan pembelian item dari mesin vending.
    // Mengembalikan objek yang berisi pesan sukses atau error.
    purchaseItem(item, quantity, payment) {
        if (this.itemPrices[item]) {
            if (this.itemStocks[item] >= quantity) {
                const totalPrice = this.itemPrices[item] * quantity;
                if (payment >= totalPrice) {
                    const change = payment - totalPrice;
                    this.itemStocks[item] -= quantity;
                    return {
                        message: `Purchased ${quantity} ${item}(s). Change: ${change} IDR`
                    };
                } else {
                    return { error: "Insufficient payment" };
                }
            } else {
                return { error: `${item} is out of stock` };
            }
        } else {
            return { error: "Invalid item selection" };
        }
    }

    // Fungsi untuk memeriksa stok item dalam mesin vending.
    // Mengembalikan daftar item yang stok-nya habis.
    checkStock() {
        const outOfStockItems = [];
        for (let item in this.itemStocks) {
            if (this.itemStocks[item] === 0) {
                outOfStockItems.push(item);
            }
        }
        return outOfStockItems;
    }
}

const app = express();
app.use(bodyParser.json());

const vendingMachine = new VendingMachine();

// API endpoint untuk mendapatkan daftar harga item.
app.get('/items', (req, res) => {
    res.json(vendingMachine.itemPrices);
});

// API endpoint untuk mendapatkan informasi stok masing-masing item.
app.get('/stock', (req, res) => {
    res.json(vendingMachine.itemStocks);
});

// API endpoint untuk melakukan pembelian.
app.post('/purchase', (req, res) => {
    const { item, quantity, payment } = req.body;
    const result = vendingMachine.purchaseItem(item, quantity, payment);
    res.json(result);
});

// API endpoint untuk mendapatkan daftar item yang stok-nya habis.
app.get('/out-of-stock', (req, res) => {
    const outOfStockItems = vendingMachine.checkStock();
    res.json(outOfStockItems);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


