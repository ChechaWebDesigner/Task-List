/* Primary Events */
import {
  showEye,
  activeChanges,
  saveChanges,
  validateCeros,
  taskAvise,
} from "./functions.js";

document.getElementById("frmTask").addEventListener("submit", function (e) {
  e.preventDefault();
  this.reset();
});

/* Indexed DB */

document.addEventListener("DOMContentLoaded", (e) => {
  const openRequest = indexedDB.open("List-Tasks", 1);

  openRequest.addEventListener("upgradeneeded", (e) => {
    const bd = openRequest.result;

    bd.createObjectStore("Tasks", {
      keyPath: "name",
    });
  });

  openRequest.addEventListener("success", function (e) {
    readTask();
  });

  openRequest.addEventListener("error", (error) => {
    console.log(`Ha ocurrido un error`, error);
  });

  const transactionProcess = (mode) => {
    const transaction = openRequest.result.transaction("Tasks", mode);
    const objectStore = transaction.objectStore("Tasks");
    return objectStore;
  };

  const addTask = (objTask) => {
    const addTask = transactionProcess("readwrite");
    addTask.add(objTask);
  };

  const deleteTask = (name) => {
    const deleteTask = transactionProcess("readwrite");
    deleteTask.delete(name);
  };

  const updateTask = (objTask) => {
    const updTask = transactionProcess("readwrite");
    updTask.put(objTask);
  };

  const readTask = () => {
    const readTask = transactionProcess("readonly");
    const reader = readTask.openCursor();
    const fragmentTasks = document.createDocumentFragment();
    let index = 0;
    reader.addEventListener("success", (e) => {
      if (!e.target.result) {
        const containerTask = document.querySelector(".container-tasks");
        if (index === 0) {
          const msgTask = document.createElement("h3");
          msgTask.classList.add("text-xl", "font-semibold", "text-center");
          msgTask.textContent = "No hay tareas";
          containerTask.appendChild(msgTask);
        } else {
          containerTask.innerHTML = "";
        }
        containerTask.appendChild(fragmentTasks);
      } else {
        /* Datos */
        const name = e.target.result.value.name;
        const day = e.target.result.value.day;
        const hour = e.target.result.value.hour;
        const minute = e.target.result.value.minute;
        const month = e.target.result.value.month;
        const year = e.target.result.value.year;

        const taskElement = document.createElement("div");
        taskElement.classList.add("task-element", "relative", "mt-6");
        taskElement.classList.add(`${name.split(" ").join("")}`);

        const principalChild = document.createElement("div");
        principalChild.classList.add("principal-child");

        const titleContainer = document.createElement("div");

        const btnEye = document.createElement("button");
        btnEye.classList.add("btnEye");

        const btnEyeDraw = document.createElement("i");
        btnEyeDraw.classList.add("fa-solid", "fa-eye");

        const spanTitle = document.createElement("span");
        spanTitle.classList.add("name-task", "capitalize", "outline-0");
        spanTitle.textContent = name;

        btnEye.appendChild(btnEyeDraw);
        titleContainer.appendChild(btnEye);
        titleContainer.appendChild(spanTitle);

        const optionsTask = document.createElement("div");
        optionsTask.classList.add("options-task");

        const btnPencil = document.createElement("button");
        btnPencil.classList.add("text-blue-600", "btnPencil");

        const btnPencilDraw = document.createElement("i");
        btnPencilDraw.classList.add("fa-solid", "fa-pen");

        btnPencil.appendChild(btnPencilDraw);

        const btnUpdate = document.createElement("button");
        btnUpdate.classList.add("text-green-600", "hidden", "btnUpdate");
        btnUpdate.setAttribute("value", index);

        const btnUpdateDraw = document.createElement("i");
        btnUpdateDraw.classList.add("fa-solid", "fa-check");

        btnUpdate.appendChild(btnUpdateDraw);

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("text-red-600", "btnDelete");

        const btnDeleteDraw = document.createElement("i");
        btnDeleteDraw.classList.add("fa-solid", "fa-trash");

        btnDelete.appendChild(btnDeleteDraw);

        optionsTask.appendChild(btnPencil);
        optionsTask.appendChild(btnUpdate);
        optionsTask.appendChild(btnDelete);

        principalChild.appendChild(titleContainer);
        principalChild.appendChild(optionsTask);

        const secondaryChild = document.createElement("div");
        secondaryChild.classList.add(
          "element-description",
          "w-full",
          "mt-4",
          "hidden",
          "absolute",
          "-top-full",
          "z-10",
          "outline-0",
          "opacity-0"
        );

        const elementDescription = document.createElement("div");
        elementDescription.classList.add("description-of-task");

        elementDescription.textContent = e.target.result.value.description;

        const date = document.createElement("div");
        date.innerHTML = `<b>Fecha de entrega</b>: ${validateCeros(
          day
        )}/${validateCeros(month + 1)}/${year} a las ${validateCeros(
          hour
        )}:${validateCeros(minute)}`;

        secondaryChild.appendChild(date);
        secondaryChild.appendChild(elementDescription);

        taskElement.appendChild(principalChild);
        taskElement.appendChild(secondaryChild);

        // events

        btnEye.addEventListener("click", (e) => {
          showEye(secondaryChild);
        });

        btnPencil.addEventListener("click", function (e) {
          activeChanges(
            this,
            btnUpdate,
            btnEye,
            secondaryChild,
            elementDescription
          );
        });

        btnUpdate.addEventListener("click", function (e) {
          saveChanges(this, btnEye, btnPencil, secondaryChild);
        });

        btnDelete.addEventListener("click", function (e) {
          deleteTask(name);
          document.querySelector(".container-tasks").removeChild(taskElement);
        });

        btnUpdate.addEventListener("click", function (e) {
          const descriptions = document.querySelectorAll(
            ".description-of-task"
          );
          const myDescription = descriptions[this.value].textContent;

          updateTask({
            name,
            description: myDescription,
            day,
            hour,
            minute,
            month,
            year,
          });
        });

        const actualDate = new Date();
        const compareDate = new Date(year, month, day, hour, minute);

        if (compareDate.getTime() - actualDate.getTime() <= 0) {
          taskElement.classList.add("task-finished", "hidden");
        }

        fragmentTasks.appendChild(taskElement);

        index++;
        e.target.result.continue();
      }
    });
  };

  /* Notification */

  if (Notification.permission === "granted") {
    taskAvise(transactionProcess);
  } else if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        taskAvise(transactionProcess);
      } else {
        alert(
          "Habilita las notificaciones, para poder avisarte cuando tu tarea expire."
        );
      }
    });
  } else {
    alert(
      "Habilita las notificaciones, para poder avisarte cuando tu tarea expire."
    );
  }

  /* Events */

  document.getElementById("btnGuardar").addEventListener("click", (e) => {
    const formData = new FormData(document.querySelector("#frmTask"));

    if (formData.get("txtNameTask").trim() !== "") {
      addTask({
        name: formData.get("txtNameTask").toLowerCase(),
        description: formData.get("txtDescriptionTask"),
        year: parseFloat(formData.get("cmbYear")),
        month: parseFloat(formData.get("cmbMonth")),
        day: parseFloat(formData.get("cmbDay")),
        hour: parseFloat(formData.get("cmbHour")),
        minute: parseFloat(formData.get("cmbMinute")),
      });

      readTask();
    }
  });
});
