// Task object constructor
function Task(task, isDone, id) {
  this.task = task;
  this.isDone = isDone;
  this.id = id;
}

// Local Storage Initialization
let tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];
let isShown = localStorage.getItem("isShown")
  ? JSON.parse(localStorage.getItem("isShown"))
  : true;
let doneCount = localStorage.getItem("doneCount")
  ? JSON.parse(localStorage.getItem("doneCount"))
  : 0;

// Check existing tasks and render
if (tasks.length > 0) {
  // If tasks exist, remove the empty message and render each task
  $(".empty").remove();
  tasks.forEach((task) => handelAppend(task));

  // If completed tasks should be hidden, hide them
  if (!isShown) {
    hide();
  }
} else {
  // If there are no tasks, display the empty message
  handelEmpty();
}

// Update progress bar
updateProgress();

// Event Handlers

// Click event for adding a new task
$("#btn").click(handelAdd);

// Keypress event for adding a new task when the Enter key is pressed
$("#inpt").keypress(function (e) {
  if (e.key == "Enter") {
    handelAdd();
  }
});

// Click event for the delete icon within a task
$("#list").on("click", "#del", function () {
  deleteConfim($(this).parent().find("p").text().trim());
});

// Make the task list sortable with jQuery UI
$("#list").sortable({
  cursor: "grab",
  axis: "y",
  helper: "clone",
  update: handelSortUpdate,
});

// Change event for the checkbox within a task
$("#list").on("change", "input:checkbox", handelDone);

// Click event for the "Clear All" button
$(".clear").click(() => deleteConfim("All tasks"));

// Click event for the "Hide Completed" button
$(".hide").click(handelToogleHide);

// Function Definitions

// Function to handle adding a new task
function handelAdd() {
  const inputVal = $("#inpt").val();
  if (inputVal.trim() !== "") {
    // If the input is not empty, add a notification, remove the empty message, create a new task, update local storage, render the task, and clear the input
    addNotification();
    $(".empty").remove();
    const newTask = new Task($("#inpt").val(), false, Date.now());
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    handelAppend(newTask);
    $("#inpt").val("");
  }
  // Update the progress bar
  updateProgress();
}

// Function to render a task
function handelAppend(task) {
  $("#list").append(
    `<div id="${task.id}" class='task'>
        <div>
          <input type='checkbox' ${task.isDone ? "checked" : ""} />
          <p class="${task.isDone ? "done" : ""}">
            ${task.task}
          </p>
        </div>
        <i id="del" class="fa-solid fa-trash"></i>
    </div>`
  );
}

// Function to handle deleting a task
function handelDelete(taskName) {
  // Display a notification, find the task in the array, update the DOM, update local storage, and handle the case when there are no tasks left
  deleteNotification();
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].task == taskName) {
      if (tasks[i].isDone) {
        decreaseDone();
      }
      let taskId = tasks[i].id;
      $("#list")
        .find("div#" + taskId)
        .remove();
      tasks.splice(i, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
  if (tasks.length == 0) {
    handelEmpty();
  }
  // Update the progress bar
  updateProgress();
}

// Function to handle marking a task as done or undone
function handelDone() {
  if ($(this).prop("checked")) {
    // If the checkbox is checked, add the "done" class, update the task status, increase the count of completed tasks, update the progress bar, and hide completed tasks if necessary
    $(this).siblings("p").addClass("done");
    for (let i = 0; i < tasks.length; i++) {
      if ($(this).parent().parent().attr("id") == tasks[i].id) {
        tasks[i].isDone = true;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }
    increaseDone();
    updateProgress();
    if (!isShown) {
      hide();
    }
  } else {
    // If the checkbox is unchecked, remove the "done" class, update the task status, decrease the count of completed tasks, and update the progress bar
    $(this).siblings("p").removeClass("done");
    for (let i = 0; i < tasks.length; i++) {
      if ($(this).parent().parent().attr("id") == tasks[i].id) {
        tasks[i].isDone = false;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }
    decreaseDone();
    updateProgress();
  }
}

// Function to handle updating the task order after sorting
function handelSortUpdate(e, ui) {
  // Create a new array to store the sorted tasks, iterate through the UI changes, and update the tasks array and local storage
  sortedTasks = [];
  for (let i = 0; i < ui.item.parent().children().length; i++) {
    for (let n = 0; n < tasks.length; n++) {
      if (ui.item.parent().children()[i].id == tasks[n].id) {
        sortedTasks.push(tasks[n]);
      }
    }
  }
  tasks = [...sortedTasks];
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to handle deleting all tasks
function handelDeleteAll() {
  if ($(".task").length) {
    // If there are tasks, remove them, update local storage, reset the count of completed tasks, update the progress bar, and display the empty message
    $(".task").remove();
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify([]));
    doneCount = 0;
    localStorage.setItem("doneCount", JSON.stringify(doneCount));
    updateProgress();
    handelEmpty();
  }
}

// Function to toggle the visibility of completed tasks
function handelToogleHide() {
  if (isShown) {
    // If completed tasks are currently visible, hide them, update local storage, update the visibility icon, and display the empty message if all tasks are completed
    isShown = !isShown;
    localStorage.setItem("isShown", JSON.stringify(isShown));
    $(".hide").children().remove();
    $(".hide").append('<i class="fa-solid fa-eye"></i>');
    hide();
  } else {
    // If completed tasks are currently hidden, show them, update local storage, update the visibility icon, and display the empty message if all tasks are completed
    isShown = !isShown;
    localStorage.setItem("isShown", JSON.stringify(isShown));
    $(".hide").children().remove();
    $(".hide").append('<i class="fa-solid fa-eye-slash"></i>');
    $("#list").children().css("display", "flex");
    $("#list").find(".empty").css("display", "block");
    if (doneCount > 0) {
      $(".empty").remove();
    }
  }
}

// Function to hide completed tasks
function hide() {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].isDone) {
      for (let n = 0; n < $("#list").children().length; n++) {
        if ($("#list").children()[n].id == tasks[i].id) {
          $("#list").children()[n].style.display = "none";
        }
      }
    }
  }
  if (tasks.length == doneCount && doneCount != 0) {
    handelEmpty();
  }
}

// Function to update the progress bar
function updateProgress() {
  // Update the progress text, percentage, and background color of the progress bar based on the number of completed tasks
  $(".progress-text").text(
    `${doneCount}/${tasks.length} ${doneCount > 1 ? "tasks" : "task"} ${
      doneCount > 1 ? "are" : ""
    } marked as done`
  );

  if (tasks.length > 0) {
    $(".progress-percentage").css(
      "width",
      `${(doneCount / tasks.length) * 100}%`
    );
  } else {
    $(".progress-percentage").css("width", "0%");
  }
  if ((doneCount / tasks.length) * 100 == 100) {
    $(".progress-percentage").css("background-color", "rgb(14, 150, 14)");
  } else {
    $(".progress-percentage").css("background-color", "rgb(5, 127, 234)");
  }
}

// Function to increase the count of completed tasks
function increaseDone() {
  doneCount++;
  localStorage.setItem("doneCount", JSON.stringify(doneCount));
}

// Function to decrease the count of completed tasks
function decreaseDone() {
  doneCount--;
  localStorage.setItem("doneCount", JSON.stringify(doneCount));
}

// Function to display the empty message
function handelEmpty() {
  $("#list").append('<p class="empty" > no available tasks</p>');
}

// Function to display a notification for adding a task
function addNotification() {
  const addNoti = $(
    '<div class="add-noti noti"> <i class="fa-solid fa-check"></i> <p>The task has been added successfully</p> </div>'
  );
  $("body").append(addNoti);
  addNoti.animate({
    bottom: "16px",
    opacity: "1",
  });
  setTimeout(function () {
    addNoti.animate({
      bottom: "-100px",
      opacity: "0",
    });
    setTimeout(() => {
      addNoti.remove();
    }, 600);
  }, 1500);
}

// Function to display a notification for deleting a task
function deleteNotification() {
  const deleteNoti = $(
    '<div class="delete-noti noti"> <i class="fa-solid fa-broom"></i> <p>The task has been deleted successfully</p> </div>'
  );
  $("body").append(deleteNoti);
  deleteNoti.animate({
    bottom: "16px",
    opacity: "1",
  });
  setTimeout(function () {
    deleteNoti.animate({
      bottom: "-100px",
      opacity: "0",
    });
    setTimeout(() => {
      deleteNoti.remove();
    }, 600);
  }, 1500);
}

// Function to display a confirmation message for deleting a task
function deleteConfim(taskName) {
  let deleteMsg = null;
  if (taskName == "All tasks" && $(".task").length == 0) {
    // If attempting to delete all tasks when there are none, display a message indicating the list is already empty
    deleteMsg = `<div class="delete-msg-wrap">
                <div class="delete-msg">
                  <p>The task list is already empty</p>
                <div>
                  <button id="cancelBtn">Ok</button>
                </div>
              </div>`;
  } else {
    // If attempting to delete a specific task, display a confirmation message
    deleteMsg = `<div class="delete-msg-wrap">
                <div class="delete-msg">
                  <p>Are you sure that you want to delete <span>${taskName}</span> from the task list ?</p>
                <div>
                  <button id="deleteBtn">Delete</button>
                  <button id="cancelBtn">Cancel</button>
                </div>
              </div>`;
  }
  $("body").append(deleteMsg);
}

// Event Delegation for the delete and cancel buttons within the confirmation message
$("body").on("click", "#deleteBtn", function () {
  // If the delete button is clicked, handle the deletion based on the task name, and remove the confirmation message
  if ($(".delete-msg-wrap").find("span").text().trim() == "All tasks") {
    handelDeleteAll();
  } else {
    handelDelete($(".delete-msg-wrap").find("span").text().trim());
  }
  $(".delete-msg-wrap").remove();
  return true;
});

$("body").on("click", "#cancelBtn", function () {
  // If the cancel button is clicked, simply remove the confirmation message
  $(".delete-msg-wrap").remove();
  return false;
});
