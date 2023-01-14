document.addEventListener("DOMContentLoaded", (e) => {
  /* ------------- Years------------- */

  const containerYears = document.getElementById("cmbYears");
  const fragmentYears = document.createDocumentFragment();
  for (let i = 1; i < 5; i++) {
    const year = document.createElement("option");
    year.textContent = 2022 + i;
    year.value = 2022 + i;
    fragmentYears.appendChild(year);
  }
  containerYears.appendChild(fragmentYears);

  /* -------- Months --------------- */

  const containerMonths = document.getElementById("cmbMonths");
  const fragmentMonths = document.createDocumentFragment();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  for (let i = 0; i < months.length; i++) {
    const month = document.createElement("option");
    month.textContent = months[i];
    month.value = i;
    fragmentMonths.appendChild(month);
  }
  containerMonths.appendChild(fragmentMonths);

  /* --------- Days -------------- */

  function daysInAMonth(month, year) {
    // Es de las pocas funciones que toman en cuenta enero como 1 en vez de 0
    return new Date(year, month, 0).getDate();
  }

  const produceDays = () => {
    const yearSelected = parseFloat(document.getElementById("cmbYears").value);
    const monthSelected =
      parseFloat(document.getElementById("cmbMonths").value) + 1;
    const days = daysInAMonth(monthSelected, yearSelected);
    for (let i = 0; i < days; i++) {
      const day = document.createElement("option");
      day.textContent = i + 1;
      day.value = i + 1;
      fragmentDays.appendChild(day);
    }
    containerDays.innerHTML = "";
    containerDays.appendChild(fragmentDays);
  };

  const containerDays = document.getElementById("cmbDays");
  const fragmentDays = document.createDocumentFragment();
  produceDays();

  /* Adding Events */

  containerMonths.addEventListener("change", (e) => {
    produceDays();
  });

  containerYears.addEventListener("change", (e) => {
    produceDays();
  });

  /* ---------- Hour --------- */

  const containerHours = document.getElementById("cmbHours");
  const fragmentsHours = document.createDocumentFragment();
  for (let i = 0; i < 24; i++) {
    const hour = document.createElement("option");
    hour.textContent = i;
    hour.value = i;
    fragmentsHours.appendChild(hour);
  }
  containerHours.appendChild(fragmentsHours);

  /* ------------ Minutes ------------ */

  const containerMinutes = document.getElementById("cmbMinutes");
  const fragmentMinutes = document.createDocumentFragment();
  for (let i = 0; i < 60; i++) {
    const minutes = document.createElement("option");
    minutes.textContent = i;
    minutes.value = i;
    fragmentMinutes.appendChild(minutes);
  }
  containerMinutes.appendChild(fragmentMinutes);
});
