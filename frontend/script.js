let allProducts = []
let allSales = []
async function addProduct() {

             document.getElementById("productMessage").innerText =
                "Adding product..."

            const productName =
                document.getElementById("name").value

            const productQuantity =
                document.getElementById("quantity").value

            const response = await fetch(
                "http://127.0.0.1:8000/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTaXJpIiwiZXhwIjoxNzgwMzA2MTUzfQ.cD3TYoHK5M__OQbxuazEEyBJAKiLtlGkPstt8XSpVP0"
                    },

                    body: JSON.stringify({
                        name: productName,
                        quantity: Number(productQuantity)
                    })
                }
            )

            const data = await response.json()

            console.log(data)

            document.getElementById("productMessage").innerText =
        data.message
            document.getElementById("name").value = ""
            document.getElementById("quantity").value = ""
            loadProducts()
            loadProductDropdown()
            loadDeleteDropdown()
        }

async function loadProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    )

    const data = await response.json()

    allProducts = data.products
    
    updateStats(allProducts, allSales)

    updateLowStock(allProducts)

    console.log(data)

    const tableBody =
        document.getElementById("productTableBody")

    tableBody.innerHTML = ""

    data.products.forEach(product => {

        const row =
            document.createElement("tr")

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
        `

        tableBody.appendChild(row)

    })
}

async function recordSale() {
            document.getElementById("saleMessage").innerText =
                "Recording sale..."
            const productId =
                document.getElementById("productId").value

            const quantitySold =
                document.getElementById("quantitySold").value

            const response = await fetch(
                "http://127.0.0.1:8000/sales",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product_id: Number(productId),
                        quantity_sold: Number(quantitySold)
                    })
                }
            )

            const data = await response.json()

            console.log(data)

            document.getElementById("saleMessage").innerText =
                data.message
            document.getElementById("productId").value = ""
            document.getElementById("quantitySold").value = ""
            loadProducts()
            loadSales()
             loadProductDropdown()
            loadDeleteDropdown()
        }
async function loadSales() {

    const response = await fetch(
        "http://127.0.0.1:8000/sales"
    )

    const data = await response.json()

    allSales = data.sales

    updateStats(allProducts, allSales)

    console.log(data)

    const tableBody =
        document.getElementById("salesTableBody")

    tableBody.innerHTML = ""

    data.sales.forEach(sale => {

        const row =
            document.createElement("tr")

        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.product_name}</td>
            <td>${sale.quantity_sold}</td>
            <td>${sale.sale_date}</td>
        `

        tableBody.appendChild(row)

    })

}
async function searchProduct() {

    const name =
        document.getElementById("searchName").value

    const response = await fetch(
        `http://127.0.0.1:8000/search?name=${name}`
    )

    const data = await response.json()

    const tableBody =
        document.getElementById("productTableBody")

    tableBody.innerHTML = ""

    data.products.forEach(product => {

        const row =
            document.createElement("tr")

        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
        `

        tableBody.appendChild(row)

    })

    document.getElementById("searchMessage").innerText =
        `${data.products.length} product(s) found`
}
async function updateProduct() {

    const productId =
        document.getElementById("updateProductId").value

    const productQuantity =
        document.getElementById("updateProductQuantity").value

    document.getElementById("updateMessage").innerText =
        "Updating product..."

    const response = await fetch(
        `http://127.0.0.1:8000/products/${productId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTaXJpIiwiZXhwIjoxNzgwMzA2MTUzfQ.cD3TYoHK5M__OQbxuazEEyBJAKiLtlGkPstt8XSpVP0"
            },

            body: JSON.stringify({
    quantity: Number(productQuantity)
})
        }
    )

    const data = await response.json()

    document.getElementById("updateMessage").innerText =
        data.message

    document.getElementById("updateProductQuantity").value = ""

    loadProducts()
    loadProductDropdown()
    loadDeleteDropdown()
}
async function loadProductDropdown() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    )

    const data = await response.json()

    const dropdown =
        document.getElementById("updateProductId")

    dropdown.innerHTML = ""

    data.products.forEach(product => {

        const option =
            document.createElement("option")

        option.value = product.id

        option.text =
            `${product.name} (Stock: ${product.quantity})`

        dropdown.appendChild(option)

    })
}
async function loadDeleteDropdown() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    )

    const data = await response.json()

    const dropdown =
        document.getElementById("deleteProductId")

    dropdown.innerHTML = ""

    data.products.forEach(product => {

        const option =
            document.createElement("option")

        option.value = product.id

        option.text =
            `${product.name} (Stock: ${product.quantity})`

        dropdown.appendChild(option)

    })
}
async function deleteProduct() {

    const productId =
        document.getElementById("deleteProductId").value

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    )

    if (!confirmed) {
        return
    }

    document.getElementById("deleteMessage").innerText =
        "Deleting product..."

    const response = await fetch(
        `http://127.0.0.1:8000/products/${productId}`,
        {
            method: "DELETE",

            headers: {
                "Authorization":
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTaXJpIiwiZXhwIjoxNzgwMzA2MTUzfQ.cD3TYoHK5M__OQbxuazEEyBJAKiLtlGkPstt8XSpVP0"
            }
        }
    )

    const data = await response.json()

    document.getElementById("deleteMessage").innerText =
        data.message

    loadProducts()
    loadProductDropdown()
    loadDeleteDropdown()
}

function updateStats(products, sales) {

    document.getElementById("totalProducts").innerText =
        products.length

    let totalStock = 0

    products.forEach(product => {
        totalStock += product.quantity
    })

    document.getElementById("totalStock").innerText =
        totalStock

    let totalSales = 0

    sales.forEach(sale => {
        totalSales += sale.quantity_sold
    })

    document.getElementById("totalSales").innerText =
        totalSales
}
function updateLowStock(products) {

    const container =
        document.getElementById("lowStockContainer")

    container.innerHTML = ""

    const lowStockProducts =
        products.filter(product => product.quantity <= 10)

    if (lowStockProducts.length === 0) {

        container.innerHTML =
            "✅ No low stock products"

        return
    }

    lowStockProducts.forEach(product => {

        const item =
            document.createElement("div")

        item.className = "low-stock-item"

        item.innerText =
            `${product.name}: ${product.quantity}`

        container.appendChild(item)

    })
}
window.onload = function () {
    loadProducts()
    loadSales()
    loadProductDropdown()
     loadDeleteDropdown()
}