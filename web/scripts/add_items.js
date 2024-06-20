var itemCount = 1;
function addItem() {
    var itemTemplate = document.getElementById("item-template");
    var itemHTML = itemTemplate.innerHTML.replace(/{index}/g, itemCount);
    document.getElementById("items").insertAdjacentHTML('beforeend', itemHTML);
    populateDropdowns(); // Call the function here
    itemCount++;
}

// Update the showCrystalsInput function to check if crystalsInput is null
function showCrystalsInput(index) {
    var crystalsInput = document.getElementById("crystals-input-" + index);
    if (crystalsInput) {
        if (document.getElementById("contains-crystals-" + index).checked) {
            crystalsInput.style.display = "block";
        } else {
            crystalsInput.style.display = "none";
        }
    }
}

function addMaterial(index) {
    var material = document.getElementById("materials-" + index).value;
    if (material !== "") {
        var materialHTML = '<div id="material-' + index + '-' + document.getElementById("materials-list-" + index).childElementCount + '">' +
                            '<label>Material:</label>' +
                            '<input type="text" value="' + material + '" disabled>' +
                            '<button type="button" onclick="removeMaterial(' + index + ', ' + document.getElementById("materials-list-" + index).childElementCount + ')">Remove</button>' +
                            '</div>';
        document.getElementById("materials-list-" + index).insertAdjacentHTML('beforeend', materialHTML);
        document.getElementById("materials-" + index).value = "";
    }
}

function removeMaterial(index, materialIndex) {
    var material = document.getElementById("material-" + index + "-" + materialIndex);
    material.parentNode.removeChild(material);
}

function populateDropdowns() {
    var index = itemCount - 1;
    eel.get_item_types()(function(itemTypes) {
        var itemTypeDropdown = document.getElementById("item-type-" + index);
        for (var j = 0; j < itemTypes.length; j++) {
            var option = document.createElement("option");
            option.value = itemTypes[j][0];
            option.textContent = itemTypes[j][1];
            itemTypeDropdown.appendChild(option);
        }
    });
    eel.get_crystals()(function(crystals) {
        var crystalDropdown = document.getElementById("crystal-" + index);
        for (var j = 0; j < crystals.length; j++) {
            var option = document.createElement("option");
            option.value = crystals[j][0];
            option.textContent = crystals[j][1];
            crystalDropdown.appendChild(option);
        }
    });
    eel.get_materials()(function(materials) {
        var materialDropdown = document.getElementById("material-" + index);
        for (var j = 0; j < materials.length; j++) {
            var option = document.createElement("option");
            option.value = materials[j][0];
            option.textContent = materials[j][1];
            materialDropdown.appendChild(option);
        }
    });
}

// Functions to show/hide additional fields
function showItemTypeFields(index) {
    var itemTypeDropdown = document.getElementById("item-type-" + index);
    var itemTypeFields = document.getElementById("item-type-fields-" + index);
    if (itemTypeDropdown.value === "new") {
        itemTypeFields.style.display = "block";
    } else {
        itemTypeFields.style.display = "none";
    }
}

function showCrystalFields(index) {
    var crystalDropdown = document.getElementById("crystal-" + index);
    var crystalFields = document.getElementById("crystal-fields-" + index);
    if (crystalDropdown.value === "new") {
        crystalFields.style.display = "block";
    } else {
        crystalFields.style.display = "none";
    }
}

function showMaterialFields(index) {
    var materialDropdown = document.getElementById("material-" + index);
    var materialFields = document.getElementById("material-fields-" + index);
    if (materialDropdown.value === "new") {
        materialFields.style.display = "block";
    } else {
        materialFields.style.display = "none";
    }
}

function submitItems() {
    var items = [];
    for (var i = 0; i < itemCount; i++) {
        var itemName = document.getElementById("item-name-" + i);
        var description = document.getElementById("description-" + i);
        var sku = document.getElementById("sku-" + i);
        var quantity = document.getElementById("quantity-" + i);
        var price = document.getElementById("price-" + i);
        var itemType = document.getElementById("item-type-" + i);
        var containsCrystals = document.getElementById("contains-crystals-" + i);
        var crystal = document.getElementById("crystal-" + i);
        var materials = document.getElementById("materials-list-" + i);
        var materialName = document.getElementById("material-name-" + i);
        var materialDescription = document.getElementById("material-description-" + i);
        var crystalName = document.getElementById("crystal-name-" + i);
        var crystalStyle = document.getElementById("crystal-style-" + i);
        
        // Check if any of the required fields are empty
        if (itemName.value === "" || sku.value === "" || quantity.value === "" || price.value === "" || itemType.value === "") {
            if (itemName.value === "") {
                itemName.classList.add("required-field");
                itemNameError.textContent = "Field required";
            } else {
                itemName.classList.remove("required-field");
                itemNameError.textContent = "";
            }
            if (sku.value === "") {
                sku.classList.add("required-field");
                skuError.textContent = "Field required";
            } else {
                sku.classList.remove("required-field");
                skuError.textContent = "";
            }
            if (quantity.value === "") {
                quantity.classList.add("required-field");
                quantityError.textContent = "Field required";
            } else {
                quantity.classList.remove("required-field");
                quantityError.textContent = "";
            }
            if (price.value === "") {
                price.classList.add("required-field");
                priceError.textContent = "Field required";
            } else {
                price.classList.remove("required-field");
                priceError.textContent = "";
            }
            if (itemType.value === "") {
                itemType.classList.add("required-field");
                // Add error message for item type
            } else {
                itemType.classList.remove("required-field");
                // Remove error message for item type
            }
        } else {
            var isDuplicate = false;
            for (var j = 0; j < items.length; j++) {
                if (items[j].item_name === itemName.value) {
                    itemName.classList.add("required-field");
                    itemNameError.textContent = "There is already an item with this name";
                    isDuplicate = true;
                }
                if (items[j].sku === sku.value) {
                    sku.classList.add("required-field");
                    skuError.textContent = "There is already an item with this SKU";
                    isDuplicate = true;
                }
            }
            if (!isDuplicate) {
                var item = {
                    item_name: itemName.value,
                    description: description.value,
                    sku: sku.value,
                    quantity: quantity.value,
                    price: price.value,
                    item_type: itemType.value,
                    contains_crystals: containsCrystals.checked,
                    crystal: containsCrystals.checked ? crystal.value : null,
                    materials: [],
                    material_name: materialName ? materialName.value : null,
                    material_description: materialDescription ? materialDescription.value : null,
                    crystal_name: crystalName ? crystalName.value : null,
                    crystal_style: crystalStyle ? crystalStyle.value : null
                };

                // Check if material is null, and if so, set it to the value of the material-name input field
                if (item.material === null) {
                    item.material = materialName.value;
                }

                if (materials && materials.children) {
                    for (var k = 0; k < materials.children.length; k++) {
                        item.materials.push({
                            material_name: materials.children[k].children[1].value,
                            material_description: materials.children[k].children[2].value
                        });
                    }
                }
                items.push(item);

                var itemElement = document.getElementById("item-" + i);
                itemElement.parentNode.removeChild(itemElement);
            }
        }
    }
    if (items.length > 0) {
        eel.add_items(items);
    }
    if (document.getElementById("items").childElementCount === 0) {
        addItem();
    }
}



// Call the showCrystalsInput function for each item when the page loads
window.onload = function() {
    populateDropdowns();
};