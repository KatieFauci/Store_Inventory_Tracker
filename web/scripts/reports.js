function generateReport() {
    var quantity = document.getElementById("quantity-input").value;
    eel.generate_report(quantity)(displayReport);
}

function displayReport(data) {
    var table = document.getElementById("report-table");
    table.innerHTML = "<tr><th>Item Name</th><th>Description</th><th>SKU</th><th>Quantity</th><th>Price</th></tr>";
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(i + 1);
        for (var j = 0; j < data[i].length; j++) {
            var cell = row.insertCell(j);
            cell.innerHTML = data[i][j];
        }
    }
}