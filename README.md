# Task Manager

Task Manager is a sleek and powerful to-do list application crafted with jQuery, designed to simplify your task management experience. It empowers users with the ability to effortlessly add, delete, and mark tasks as done, providing an elegant and user-friendly interface for organizing tasks.

Features

1. ### Add Tasks with Ease
   Adding new tasks is a breeze. Simply type your task in the input field and hit "Enter" or click the "+" button to instantly add it to your to-do list.

``` JavaScript
// Event listener for adding tasks
$("#btn").click(handelAdd);

// Keypress event for adding a new task when the Enter key is pressed
$("#inpt").keypress(function (e) {
if (e.key == "Enter") {
handelAdd();
}
});
```

2. ### Effortless Task Deletion
   Delete tasks seamlessly with a click. Whether you want to remove individual tasks or wipe the slate clean with all tasks, Task Manager offers a smooth deletion experience.

``` JavaScript
// Click event for the delete icon within a task
$("#list").on("click", "#del", function () {
  deleteConfim($(this).parent().find("p").text().trim());
});

// Click event for the "Clear All" button
$(".clear").click(() => deleteConfim("All tasks"));
```

3. ### Task Completion Made Simple
   Toggle the completion status of tasks by checking or unchecking the checkbox. Task Manager streamlines the process of marking tasks as done.

``` JavaScript
// Change event for the checkbox within a task
$("#list").on("change", "input:checkbox", handelDone);
```

4. ### Intuitive Task Sorting
   Organize your tasks effortlessly by dragging and dropping them into your preferred order. Task Manager's intuitive sorting feature enhances your task management workflow.

``` JavaScript
// Make the task list sortable with jQuery UI
$("#list").sortable({
cursor: "grab",
axis: "y",
helper: "clone",
update: handelSortUpdate,
});
```

5. ### Real-time Progress Tracking
   Stay informed about your progress with a dynamic progress bar. Task Manager provides a real-time visual representation of completed tasks.

``` JavaScript
// Function to update the progress bar
function updateProgress() {
// Update the progress text, percentage, and background color of the progress bar based on the number of completed tasks
// ...
}
```

6. ### Flexible Visibility Toggle
   Toggle the visibility of completed tasks to focus on active tasks. Task Manager provides flexibility to tailor your task list display according to your preferences.

``` JavaScript
// Click event for the "Hide Completed" button
$(".hide").click(handelToogleHide);
```

7. ### Visual Notifications
   Receive instant visual feedback for successful task additions and deletions. Task Manager enhances user interaction with subtle yet effective notifications.

``` JavaScript
// Function to display a notification for adding a task
function addNotification() {
// ...
}

// Function to display a notification for deleting a task
function deleteNotification() {
// ...
}
```

Getting Started
Clone the repository:
git clone https://github.com/KungFuKelo/jQuaery-todo-app.git
Open index.html in your web browser.
Contributing
Contributions are welcome! Fork the repository and create a pull request. If you have any issues or feature requests, feel free to raise them.
