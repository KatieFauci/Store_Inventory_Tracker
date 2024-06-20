function searchItems() {
    var query = document.getElementById("search-bar").value;
    var criteria = document.querySelector('input[name="search-criteria"]:checked').value;
    eel.search_data(query, criteria)(displayResults);
}

function displayResults(data) {
    var table = document.getElementById("inventory-table");
    table.innerHTML = "<tr><th>Item Name</th><th>SKU</th><th>Quantity</th><th>Price</th><th>Crystal Type(s)</th><th>Description</th><th>Actions</th></tr>";
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(i + 1);
        for (var j = 0; j < data[i].length; j++) {
            var cell = row.insertCell(j);
            cell.innerHTML = data[i][j];
            if (j === 2) {
                var quantityCell = cell;
                var quantity = parseInt(data[i][2]);

                var increaseButton = document.createElement('button');
                increaseButton.innerHTML = '<i class="fa fa-plus"></i>';
                increaseButton.className = 'increase-button';
                increaseButton.onclick = function() {
                    var sku = this.closest('tr').cells[1].innerHTML;
                    eel.increase_quantity(sku)(searchItems);
                };

                var decreaseButton = document.createElement('button');
                decreaseButton.innerHTML = '<i class="fa fa-minus"></i>';
                decreaseButton.className = 'decrease-button';
                decreaseButton.onclick = function() {
                    var sku = this.closest('tr').cells[1].innerHTML;
                    eel.decrease_quantity(sku)(searchItems);
                };

                var buttonContainer = document.createElement('div');
                buttonContainer.style = 'display: inline-block; vertical-align: middle;';
                buttonContainer.appendChild(increaseButton);
                buttonContainer.appendChild(decreaseButton);
                quantityCell.appendChild(buttonContainer);
            }
        }
        var quantity = parseInt(data[i][2]);
        if (quantity <= 5) {
            row.classList.add("low-quantity");
        } else if (quantity <= 10) {
            row.classList.add("medium-quantity");
        } else {
            row.classList.add("high-quantity");
        }
        var actionsCell = row.insertCell(data[i].length);
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fa fa-times"></i>';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = function() {
            var sku = this.parentNode.parentNode.cells[1].innerHTML;
            if (confirm('Are you sure you want to delete item with SKU ' + sku + '?')) {
                eel.delete_item(sku)(searchItems);
            }
        };
        actionsCell.appendChild(deleteButton);

        var updateButton = document.createElement('button');
        updateButton.innerHTML = '<i class="fa fa-pencil"></i>';
        updateButton.className = 'update-button';
        updateButton.onclick = function() {
            var item = {
                item_name: this.parentNode.parentNode.cells[0].innerHTML,
                sku: this.parentNode.parentNode.cells[1].innerHTML,
                quantity: this.parentNode.parentNode.cells[2].innerHTML,
                price: this.parentNode.parentNode.cells[3].innerHTML,
                crystal_names: this.parentNode.parentNode.cells[4].innerHTML,
                description: this.parentNode.parentNode.cells[5].innerHTML
            };

            var updateDialog = document.createElement('dialog');
            updateDialog.innerHTML = 'Item Name: <input type="text" value="' + item.item_name + '"><br>' +
                                    'SKU: <input type="text" value="' + item.sku + '"><br>' +
                                    'Quantity: <input type="number" value="' + item.quantity + '" disabled><br>' +
                                    'Price: <input type="number" value="' + item.price + '"><br>' +
                                    'Crystal Type(s): <input type="text" value="' + item.crystal_names + '"><br>' +
                                    'Description: <input type="text" value="' + item.description + '"><br>' +
                                    '<button type="button" id="submit-update">Submit</button>';
            document.body.appendChild(updateDialog);
            updateDialog.showModal();

            document.getElementById('submit-update').onclick = function() {
                item.item_name = updateDialog.children[0].value;
                item.sku = updateDialog.children[2].value;
                item.price = updateDialog.children[6].value;
                item.crystal_names = updateDialog.children[8].value;
                item.description = updateDialog.children[10].value;
                eel.update_item(item)(searchItems);
                updateDialog.close();
                document.body.removeChild(updateDialog);
            };
        };
        actionsCell.appendChild(updateButton);

        var adjustButton = document.createElement('button');
        adjustButton.innerHTML = '<i class="fa fa-adjust"></i>';
        adjustButton.className = 'adjust-button';
        adjustButton.onclick = function() {
            var sku = this.parentNode.parentNode.cells[1].innerHTML;
            var adjustDialog = document.createElement('dialog');
            adjustDialog.innerHTML = 'Adjust Quantity: <input type="number" id="adjust-quantity" value="0"><br>' +
                                    '<button type="button" id="add-quantity">Add</button>' +
                                    '<button type="button" id="remove-quantity">Remove</button>' +
                                    '<button type="button" id="cancel-adjust">Cancel</button>';
            document.body.appendChild(adjustDialog);
            adjustDialog.showModal();

            document.getElementById('add-quantity').onclick = function() {
                var quantity = parseInt(document.getElementById('adjust-quantity').value);
                eel.adjust_quantity(sku, quantity)(searchItems);
                adjustDialog.close();
                document.body.removeChild(adjustDialog);
            };

            document.getElementById('remove-quantity').onclick = function() {
                var quantity = -parseInt(document.getElementById('adjust-quantity').value);
                eel.adjust_quantity(sku, quantity)(searchItems);
                adjustDialog.close();
                document.body.removeChild(adjustDialog);
            };

            document.getElementById('cancel-adjust').onclick = function() {
                adjustDialog.close();
                document.body.removeChild(adjustDialog);
            };
        };
        actionsCell.appendChild(adjustButton);
    }
}

searchItems();