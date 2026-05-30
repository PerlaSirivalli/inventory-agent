
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
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTaXJpIiwiZXhwIjoxNzgwMTQzODA4fQ.m9bErdPC5QBV0j2QKuzUo7wn4axsP96RJDzC26CJ_rM"
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
        }

async function loadProducts() {

    const response = await fetch(
        "http://127.0.0.1:8000/products"
    )

    const data = await response.json()

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
        }
async function loadSales() {

    const response = await fetch(
        "http://127.0.0.1:8000/sales"
    )

    const data = await response.json()

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
        `

        tableBody.appendChild(row)

    })

}
loadProducts()
loadSales()