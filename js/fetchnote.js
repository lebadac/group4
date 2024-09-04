function fetchNotesAndUpdateHTML() {
    return fetch('http://localhost:2001/notes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update HTML with fetched data
            console.log('Notes fetched successfully');
            renderNotes(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function renderNotes(data) {
    const todoListElement = document.getElementById('todo-list');

    if (todoListElement) {
        // Clear the todo list
        todoListElement.innerHTML = '';

        // Loop through the data and create HTML elements
        data.forEach(note => {
            const todoElement = document.createElement('div');
            todoElement.classList.add('todo');
            todoElement.dataset.id = note.id; // Add data-id attribute

            const taskNameElement = document.createElement('h3');
            taskNameElement.textContent = note.TaskName;

            const typeElement = document.createElement('span');
            typeElement.classList.add('task-type');
            typeElement.textContent = note.Type;

            // Set color based on the type
            switch (note.Type) {
                case 'urgent-important':
                    typeElement.style.color = 'red';
                    break;
                case 'urgent-not-important':
                    typeElement.style.color = 'blue';
                    break;
                case 'not-urgent-important':
                    typeElement.style.color = 'green';
                    break;
                case 'not-urgent-not-important':
                    typeElement.style.color = 'black';
                    break;
                default:
                    typeElement.style.color = 'black';
            }

            // Add data-color attribute
            typeElement.setAttribute("data-color", note.Type);

            const finishTodoButton = document.createElement('button');
            finishTodoButton.classList.add('finish-todo');
            finishTodoButton.addEventListener('click', () => markTaskAsDone(note.id)); // Add click event listener
            const finishTodoIcon = document.createElement('i');
            finishTodoIcon.classList.add('fa-solid', 'fa-check');
            finishTodoButton.appendChild(finishTodoIcon);



            const editTodoButton = document.createElement('button');
            editTodoButton.classList.add('edit-todo');
            const editTodoIcon = document.createElement('i');
            editTodoButton.addEventListener('click', () => {
                localStorage.setItem('editingTaskId', note.id);
            });
            editTodoIcon.classList.add('fa-solid', 'fa-pen');
            editTodoButton.appendChild(editTodoIcon);

            const removeTodoButton = document.createElement('button');
            removeTodoButton.classList.add('remove-todo');
            const removeTodoIcon = document.createElement('i');
            removeTodoIcon.classList.add('fa-solid', 'fa-xmark');
            removeTodoButton.appendChild(removeTodoIcon);

            // Add the click event listener for the remove button
            removeTodoButton.addEventListener('click', () => {
                removeTask(note.id);
            });

            // Check the initial status to add the 'done' class if needed
            if (note.Status === 'done') {
                todoElement.classList.add('done');
            }

            todoElement.appendChild(taskNameElement);
            todoElement.appendChild(typeElement);
            todoElement.appendChild(finishTodoButton);
            todoElement.appendChild(editTodoButton);
            todoElement.appendChild(removeTodoButton);

            todoListElement.appendChild(todoElement);
        });
    } else {
        console.error('Error: #todo-list element not found in the DOM');
    }
}

function markTaskAsDone(taskId) {
    // Log current task ID
    console.log('Current task ID:', taskId);

    // Code to update the task status to "Done" on the server
    fetch(`http://localhost:2001/notes/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        // No need to send the status in the request body, as the server-side route will update the status to "Done"
    })
        .then(response => {
            if (response.ok) {
                console.log('Task marked as done');

                // Parse response body as JSON
                return response.json();
            } else {
                console.error('Error marking task as done');
            }
        })
        .then(data => {
            // Log data when found in the database
            console.log('Data found in database:', data);

            // Update the UI to reflect the change immediately
            const todoElement = document.querySelector(`.todo[data-task-id="${taskId}"]`);
            if (todoElement) {
                if (data.Status === 'done') {
                    todoElement.classList.add('done');
                } else if (data.Status === 'pending') {
                    todoElement.classList.remove('done');
                }
            }
        })
        .catch(error => {
            console.error('Error updating task status:', error);
        });
    window.location.reload();

}

function removeTask(taskId) {
    fetch(`http://localhost:2001/notes/${taskId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Task removed successfully');
                // Optionally, you can call fetchNotesAndUpdateHTML() here to refresh the UI
            } else {
                console.error('Error removing task');
            }
        })
        .catch(error => {
            console.error('Error removing task:', error);
        });
    window.location.reload();
}


// Fetch and render the notes
fetchNotesAndUpdateHTML()
    .catch(error => console.error('Error rendering notes:', error));