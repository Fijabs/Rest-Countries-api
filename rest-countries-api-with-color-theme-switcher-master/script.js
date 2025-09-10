const apiURL = "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,flags,population,currencies,languages,tld,borders";
const countryList = document.getElementById("country-list");
const searchInput = document.getElementById("search");
const regionFilter = document.getElementById("region-filter");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const countryDetailSection = document.getElementById("country-detail");
const backButton = document.getElementById("back");

let allCountries = [];

fetch(apiURL)
  .then(res => {
    if (!res.ok) throw new Error("Bad request");
    return res.json();
  })
  .then(data => {
    allCountries = data;
    renderCountries(allCountries);
  })
  .catch(err => {
    console.error("Fetch error:", err);
    countryList.innerHTML = `<p>Failed to load countries.</p>`;
  });

function renderCountries(countries) {
  countryList.innerHTML = "";
  countryDetailSection.classList.add("hidden");

  if (countries.length === 0) {
    countryList.innerHTML = "<p>No countries found.</p>";
    return;
  }

  countries.forEach(country => {
    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
      <div class="card-content">
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital?.[0] || "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      </div>
    `;
    card.addEventListener("click", () => showCountryDetail(country));
    countryList.appendChild(card);
  });
}

function showCountryDetail(country) {
  countryList.innerHTML = "";
  countryDetailSection.classList.remove("hidden");

  document.getElementById("country-flag").src = country.flags.svg;
  document.getElementById("country-name").textContent = country.name.common;
  document.getElementById("native-name").textContent = country.name.official;
  document.getElementById("population").textContent = country.population.toLocaleString();
  document.getElementById("region").textContent = country.region;
  document.getElementById("subregion").textContent = country.subregion || "N/A";
  document.getElementById("capital").textContent = country.capital?.[0] || "N/A";
  document.getElementById("tld").textContent = country.tld?.join(", ") || "N/A";
  document.getElementById("currencies").textContent = country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "N/A";
  document.getElementById("languages").textContent = country.languages ? Object.values(country.languages).join(", ") : "N/A";

  const borders = country.borders || [];
  const borderEl = document.getElementById("borders");
  borderEl.innerHTML = "";
  if (borders.length > 0) {
    borders.forEach(border => {
      const span = document.createElement("span");
      span.textContent = border;
      borderEl.appendChild(span);
    });
  } else {
    borderEl.textContent = "None";
  }
}

backButton.addEventListener("click", () => {
  countryDetailSection.classList.add("hidden");
  renderCountries(allCountries);
});

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = allCountries.filter(country =>
    country.name.common.toLowerCase().includes(value)
  );
  renderCountries(filtered);
});

regionFilter.addEventListener("change", () => {
  const region = regionFilter.value;
  const filtered = region
    ? allCountries.filter(country => country.region === region)
    : allCountries;
  renderCountries(filtered);
});

darkModeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    darkModeToggle.textContent = "🌙 Dark Mode";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeToggle.textContent = "☀️ Light Mode";
  }
});
