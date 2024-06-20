function addItem() {
    var task = document.getElementById("task").value;
    var done = document.getElementById("done").checked;
    eel.add_todo_item(task, done);
    document.getElementById("todo-list-form").reset();
}

function deleteItem(task) {
    eel.delete_todo_item(task);
}

function updateItem(task) {
    var newTask = prompt("Enter new task:");
    var newDone = prompt("Enter new done (true/false):");
    eel.update_todo_item(task, newTask, newDone);
}

eel.get_todo_list()(displayTodoList);

function displayTodoList(data) {
    var table = document.getElementById("todo-list-table");
    table.innerHTML = "<tr><th>Task</th><th>Done</th><th>Actions</th></tr>";
    for (var i = 0; i < data.length; i++) {
        var row = table.insertRow(i + 1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = data[i][0];
        cell2.innerHTML = data[i][1];
        cell3.innerHTML = '<button onclick="deleteItem(\'' + data[i][0] + '\')">Delete</button><button onclick="updateItem(\'' + data[i][0] + '\')">Update</button>';
    }
}