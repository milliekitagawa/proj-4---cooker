let powerOn = false;
let cookingOn = false;
let waterNone = false;

const powerButton = document.getElementById("powerButton");
const cookSwitch = document.getElementById("cookSwitch");
let waterAmount = 100;
let evaporationTimer;
const waterLevel = document.getElementById("waterLevel");
const waterGauge = document.getElementById("waterGauge");
const waterText = document.getElementById("waterText");
const greenLight = document.getElementById("greenLight");
const redLight = document.getElementById("redLight");
const status = document.getElementById("status");

function updateCooker() {
  // Both lights are grey unless their "on" class is added.
  redLight.classList.remove("on");
  greenLight.classList.remove("on");

  if (powerOn === true) {
    if (cookingOn === true && waterNone === false) {
      redLight.classList.add("on");
      status.textContent = "COOKING";
    } else {
      greenLight.classList.add("on");
      status.textContent = "KEEP WARM";
    }
  } else {
    status.textContent = "OFF";
  }

  powerButton.classList.toggle("on", powerOn);
  powerButton.setAttribute("aria-checked", String(powerOn));
  cookSwitch.classList.toggle("down", cookingOn);
  cookSwitch.setAttribute("aria-checked", String(cookingOn));
  cookSwitch.disabled = !powerOn;
  waterLevel.style.height = waterAmount + "%";
  waterGauge.setAttribute("aria-valuenow", String(waterAmount));
  waterText.textContent = waterAmount + "%";
}

powerButton.addEventListener("click", function () {
  clearInterval(evaporationTimer);
  powerOn = !powerOn;
  cookingOn = false;
  updateCooker();
});

cookSwitch.addEventListener("click", function () {
  if (!powerOn) return;

  cookingOn = !cookingOn;
  // Starting another cooking cycle assumes water has been added.
  clearInterval(evaporationTimer);
  if (cookingOn) {
    waterNone = false;
    waterAmount = 100;
    startEvaporation();
  }
  updateCooker();
});

// Drain a full batch in 10 seconds while cooking.
function startEvaporation() {
  evaporationTimer = setInterval(function () {
    waterAmount = Math.max(0, waterAmount - 1);
    if (waterAmount === 0) {
      clearInterval(evaporationTimer);
      waterNone = true;
      cookingOn = false; // The cooking switch pops back up.
    }
    updateCooker();
  }, 100);
}

updateCooker();
