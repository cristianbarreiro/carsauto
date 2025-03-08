const yearSelect = document.querySelector("#year-select");
const brandSelect = document.querySelector("#brand-select");
const modelSelect = document.querySelector("#model-select");
const carsContainer = document.querySelector("#cars");
const filterButton = document.querySelector("#filter-button");
const alertContainer = document.querySelector("#alert-container");

let stringParaInsertar = "";
for (let index = 2025; index >= 1900; index--) {
  stringParaInsertar += `<option value="${index}">${index}</option>`;
}

yearSelect.insertAdjacentHTML("beforeend", stringParaInsertar);

fetch("https://ha-front-api-proyecto-final.vercel.app/brands")
  .then((response) => response.json())
  .then((marcas) => {
    let brandMarcas = "";
    for (const marca of marcas) {
      brandMarcas += `<option value="${marca}">${marca}</option>`;
    }
    brandSelect.insertAdjacentHTML("beforeend", brandMarcas);
  });

brandSelect.addEventListener("change", () => {
  modelSelect.innerHTML =
    "<option value disabled selected>Seleccionar...</option>";
  load_models(brandSelect.value);
});

function load_models(brand) {
  fetch(`https://ha-front-api-proyecto-final.vercel.app/models?brand=${brand}`)
    .then((response) => response.json())
    .then((modelos) => {
      if (Array.isArray(modelos) && modelos.length > 0) {
        modelSelect.removeAttribute("disabled");
        let carModels = "";
        for (const modelo of modelos) {
          carModels += `<option value="${modelo}">${modelo}</option>`;
        }
        modelSelect.insertAdjacentHTML("beforeend", carModels);
      } else {
        modelSelect.setAttribute("disabled", true);
      }
    });
}

function load_cars() {
  fetch("https://ha-front-api-proyecto-final.vercel.app/cars")
    .then((response) => response.json())
    .then((carsData) => {
      let carsHTML = "";

      if (Array.isArray(carsData) && carsData.length > 0) {
        for (const car of carsData) {
          let priceUSD = new Intl.NumberFormat("en-US").format(car.price_usd);
          let priceUYU = new Intl.NumberFormat("es-UY").format(car.price_uyu);
          carsHTML += `
            <div class="car" data-id="${car.id}">
              <div class="row">
                <div class="col-img col-lg-4">
                  <div class="position-relative">
                    <img src="${car.image}" alt="${car.model}" />
                    <span class="badge">${
                      car.status === 0 ? "Nuevo" : "Usado"
                    }</span>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="row">
                    <div class="col-xl-6">
                      <h3>${car.model}</h3>
                    </div>
                    <div class="col-xl-6">
                      <div class="car-info">
                        ${car.year} | USD ${priceUSD} | UYU ${priceUYU}
                        <div class="rating">
                          ${"★".repeat(car.rating)}${"☆".repeat(5 - car.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="car-description">${car.description}</p>
                  <div class="car-footer">
                    <button type="button" class="btn btn-success btn-sm">
                      <i class="fas fa-shopping-cart"></i> Comprar
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <i class="far fa-plus-square"></i> Más info
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <i class="far fa-share-square"></i> Compartir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
        carsContainer.innerHTML = "";
        carsContainer.insertAdjacentHTML("beforeend", carsHTML);
      }
    });
}
load_cars();
filterButton.addEventListener("click", () => {
  const year = yearSelect.value;
  const brand = brandSelect.value;
  const model = modelSelect.value;

  const params = new URLSearchParams();
  if (year) params.append("year", year);
  if (brand) params.append("brand", brand);
  if (model) params.append("model", model);

  const url = `https://ha-front-api-proyecto-final.vercel.app/cars?${params.toString()}`;

  fetch(url)
    .then((response) => response.json())
    .then((carsData) => {
      if (carsData.length === 0) {
        let alert = `<div class="alert alert-warning d-flex alert-fixed position-fixed h-auto" id="filter-alert" role="alert">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill me-1 mt-1" viewBox="0 0 16 16">
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>
    <div class="fs-6 text-truncate text-wrap d-inline" id="alert-text">
    <p>
        No se encuentran autos con esas características
        </p>
    </div>
</div>
`;

        if (!document.querySelector("#filter-alert")) {
          document.body.insertAdjacentHTML("beforeend", alert);

          setTimeout(() => {
            let alertElement = document.querySelector("#filter-alert");
            if (alertElement) {
              alertElement.classList.remove("show"); // Desvanecer
              alertElement.classList.add("fade"); // Efecto de salida

              // Eliminar DOM element después de 500ms (tiempo del fade)
              setTimeout(() => {
                if (alertElement) {
                  alertElement.remove();
                }
              }, 500);
            }
          }, 1000);
        }
        load_cars();
      } else {
        let carsHTML = "";
        for (const car of carsData) {
          let priceUSD = new Intl.NumberFormat("en-US").format(car.price_usd);
          let priceUYU = new Intl.NumberFormat("es-UY").format(car.price_uyu);
          carsHTML += `
            <div class="car" data-id="${car.id}">
              <div class="row">
                <div class="col-img col-lg-4">
                  <div class="position-relative">
                    <img src="${car.image}" alt="${car.model}" />
                    <span class="badge">${
                      car.status === 0 ? "Nuevo" : "Usado"
                    }</span>
                  </div>
                </div>
                <div class="col-lg-8">
                  <div class="row">
                    <div class="col-xl-6">
                      <h3>${car.model}</h3>
                    </div>
                    <div class="col-xl-6">
                      <div class="car-info">
                        ${car.year} | USD ${priceUSD} | UYU ${priceUYU}
                        <div class="rating">
                          ${"★".repeat(car.rating)}${"☆".repeat(5 - car.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p class="car-description">${car.description}</p>
                  <div class="car-footer">
                    <button type="button" class="btn btn-success btn-sm">
                      <i class="fas fa-shopping-cart"></i> Comprar
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <i class="far fa-plus-square"></i> Más info
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm">
                      <i class="far fa-share-square"></i> Compartir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }
        carsContainer.innerHTML = "";
        carsContainer.insertAdjacentHTML("beforeend", carsHTML);
      }
    });
});
