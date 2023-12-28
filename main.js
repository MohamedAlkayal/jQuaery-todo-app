function Task(task, isDone, id) {
  this.task = task;
  this.isDone = isDone;
  this.id = id;
}

let tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

let isShown = localStorage.getItem("isShown")
  ? JSON.parse(localStorage.getItem("isShown"))
  : true;

let doneCount = localStorage.getItem("doneCount")
  ? JSON.parse(localStorage.getItem("doneCount"))
  : 0;

if (tasks.length > 0) {
  $(".empty").remove();
  tasks.forEach((task) => handelAppend(task));
  if (!isShown) {
    hide();
  }
} else {
  handelEmpty();
}

updateProgress();

$("#btn").click(handelAdd);
$("#inpt").keypress(function (e) {
  if (e.key == "Enter") {
    handelAdd();
  }
});

$("#list").on("click", "#del", function () {
  deleteConfim($(this).parent().find("p").text().trim());
});

$("#list").sortable({
  cursor: "grab",
  axis: "y",
  helper: "clone",
  update: handelSortUpdate,
});

$("#list").on("change", "input:checkbox", handelDone);

$(".clear").click(() => deleteConfim("All tasks"));

$(".hide").click(handelToogleHide);

function handelAdd() {
  const inputVal = $("#inpt").val();
  if (inputVal.trim() !== "") {
    addNotification();
    $(".empty").remove();
    const newTask = new Task($("#inpt").val(), false, Date.now());
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    handelAppend(newTask);
    $("#inpt").val("");
  }
  updateProgress();
}

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

function handelDelete(taskName) {
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
  updateProgress();
}

function handelDone() {
  if ($(this).prop("checked")) {
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

function handelSortUpdate(e, ui) {
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

function handelDeleteAll() {
  if ($(".task").length) {
    $(".task").remove();
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify([]));
    doneCount = 0;
    localStorage.setItem("doneCount", JSON.stringify(doneCount));
    updateProgress();
    handelEmpty();
  }
}

function handelToogleHide() {
  if (isShown) {
    isShown = !isShown;
    localStorage.setItem("isShown", JSON.stringify(isShown));
    $(".hide").children().remove();
    $(".hide").append('<i class="fa-solid fa-eye"></i>');
    hide();
  } else {
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

function updateProgress() {
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

function increaseDone() {
  doneCount++;
  localStorage.setItem("doneCount", JSON.stringify(doneCount));
}

function decreaseDone() {
  doneCount--;
  localStorage.setItem("doneCount", JSON.stringify(doneCount));
}

function handelEmpty() {
  $("#list").append('<p class="empty" > no available tasks</p>');
}

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

function deleteConfim(taskName) {
  let deleteMsg = null;
  if (taskName == "All tasks" && $(".task").length == 0) {
    deleteMsg = `<div class="delete-msg-wrap">
                <div class="delete-msg">
                  <p>The task list is already empty</p>
                <div>
                  <button id="cancelBtn">Ok</button>
                </div>
              </div>`;
  } else {
    deleteMsg = `<div class="delete-msg-wrap">
                <div class="delete-msg">
                  <p>Are you sure that you want to delete <span>${taskName}</span> from task list ?</p>
                <div>
                  <button id="deleteBtn">Delete</button>
                  <button id="cancelBtn">Cancel</button>
                </div>
              </div>`;
  }
  $("body").append(deleteMsg);
}

$("body").on("click", "#deleteBtn", function () {
  if ($(".delete-msg-wrap").find("span").text().trim() == "All tasks") {
    handelDeleteAll();
  } else {
    handelDelete($(".delete-msg-wrap").find("span").text().trim());
  }
  $(".delete-msg-wrap").remove();
  return true;
});

$("body").on("click", "#cancelBtn", function () {
  $(".delete-msg-wrap").remove();
  return false;
});
