export function showEye(descriptionElement) {
  descriptionElement.classList.toggle("hidden");
  descriptionElement.classList.toggle("animate-getDown");
}

export function activeChanges({
  element,
  btnUpdate,
  btnEye,
  containerDescription,
  descriptionElement,
}) {
  element.classList.toggle("hidden");
  btnUpdate.classList.toggle("hidden");
  btnEye.classList.toggle("hidden");
  containerDescription.classList.remove("hidden");
  containerDescription.classList.add("animate-getDown");

  descriptionElement.setAttribute("contenteditable", true);
}

export function saveChanges({
  element,
  btnEye,
  btnPencil,
  descriptionElement,
}) {
  element.classList.toggle("hidden");
  btnEye.classList.toggle("hidden");
  btnPencil.classList.toggle("hidden");
  descriptionElement.classList.toggle("hidden");
  descriptionElement.classList.toggle("animate-getDown");
}

export function validateCeros(num) {
  return num.toString().padStart(2, 0);
}

export function evaluateTask({
  transactionProcess,
  day,
  month,
  year,
  hour,
  minutes,
}) {
  const readTask = transactionProcess("readonly");
  const reader = readTask.openCursor();

  reader.addEventListener("success", (e) => {
    if (e.target.result) {
      if (
        e.target.result.value.day === day &&
        e.target.result.value.minute === minutes &&
        e.target.result.value.month === month &&
        e.target.result.value.hour === hour &&
        e.target.result.value.year === year
      ) {
        let nameClass = e.target.result.value.name;
        const taskFinished = document.querySelector(
          `.${nameClass.split(" ").join("")}`
        );
        const notificacion = new Notification("¡Recordatorio!", {
          body: `La tarea de ${e.target.result.value.name} ha expirado`,
          icon: "https://cdn-icons-png.flaticon.com/512/497/497738.png",
        });
        taskFinished.classList.add("task-finished");
        const btnPencil = taskFinished.querySelector(
          ".principal-child .options-task .btnPencil"
        );
        btnPencil.parentNode.removeChild(btnPencil);
      }

      e.target.result.continue();
    } 
    // else {
    //   console.log("Pizza") // Esto se ejecuta cuando termina el intervalo de examinar tarea
    // }
  });
}

export function taskAvise(transactionProcess) {
  const actualDate = new Date();
  const time = 60 - actualDate.getSeconds();
  setTimeout(() => {
    checkTask(transactionProcess);
    setInterval(() => {
      checkTask(transactionProcess);
    }, 60000);
  }, time * 1000);
}

function checkTask(transactionProcess) {
  const date = new Date();

  const dateArr = date.toString().split(" ");

  const day = parseFloat(dateArr[2]);
  const year = parseFloat(dateArr[3]);
  const dateComplete = dateArr[4].split(":");

  const hour = parseFloat(dateComplete[0]);
  const minutes = parseFloat(dateComplete[1]);

  const month = date.getMonth();

  evaluateTask({ transactionProcess, day, month, year, hour, minutes });
}
