const todoForm = document.querySelector("#todo-form");
todoForm.addEventListener("submit", async (e) => {
    //e.preventDefault();
    const taskName = todoInput.value;
    const taskType = taskTypeInput.value;

    try {
        const response = await fetch('http://localhost:2001/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                TaskName: taskName,
                Type: taskType,
                Status: 'pending', // Assuming default status as 'pending'
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            //alert('Task added successfully!');
            // Clear the input fields
            todoInput.value = '';
            taskTypeInput.value = 'urgent-important';
        } else {
            const errorMessage = await response.text();
            //alert('Failed to add task. Error: ' + errorMessage);
        }
    } catch (error) {
        console.error('Error:', error);
        // alert('Failed to add task. Error: ' + error.message);
    }
});

