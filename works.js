var fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

function addFadeIn(element, delay) {
    element.classList.add("fade-in");
    if (delay) {
        element.style.transitionDelay = delay + "s";
        element.addEventListener("transitionend", function() {
            element.style.transitionDelay = "";
        }, { once: true });
    }
    fadeObserver.observe(element);
}

document.querySelectorAll("section h1, section h3, #about p, .works-controls").forEach(function(element) {
    addFadeIn(element, 0);
});

fetch("works.csv")
    .then(function(response) {
        return response.text();
    })
    .then(function(data) {

        var rows = data.trim().split("\n");

        var headers = rows[0].split(",");

        var works = rows.slice(1).map(function(row) {

            var values = row.split(",");

            var work = {};

            headers.forEach(function(header, index) {
                work[header] = values[index];
            });

            return work;
        });

        var grid = document.getElementById("works-grid");

        var categorySelect = document.getElementById("category");

        var sortSelect = document.getElementById("sort");

        var categories = [];

        works.forEach(function(work) {
            if (!categories.includes(work.category)) {
                categories.push(work.category);
            }
        });

        categories.forEach(function(category) {
            var option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        function displayWorks() {

            var selectedCategory = categorySelect.value;

            var sortType = sortSelect.value;

            var filteredWorks = works.slice();

            if (selectedCategory !== "all") {
                filteredWorks = filteredWorks.filter(function(work) {
                    return work.category === selectedCategory;
                });
            }

            if (sortType === "new") {
                filteredWorks.sort(function(a, b) {
                    return Number(b.year) - Number(a.year);
                });
            }
            else if (sortType === "old") {
                filteredWorks.sort(function(a, b) {
                    return Number(a.year) - Number(b.year);
                });
            }
            else if (sortType === "title") {
                filteredWorks.sort(function(a, b) {
                    return a.title.localeCompare(b.title, "ja");
                });
            }

            grid.innerHTML = "";

            filteredWorks.forEach(function(work, index) {

                var card = document.createElement("article");

                card.className = "work-card";

                card.innerHTML =
                    '<a href="' + work.link + '">' +
                        '<div class="work-thumb"><img src="' + work.image + '" alt="' + work.title + '"></div>' +
                        '<div class="work-info">' +
                            '<p class="work-category">' + work.category + '</p>' +
                            '<h4>' + work.title + '</h4>' +
                            '<p>' + work.description + '</p>' +
                            '<p class="work-year">' + work.year + '</p>' +
                        '</div>' +
                    '</a>';

                grid.appendChild(card);
                addFadeIn(card, index * 0.1);
            });
        }

        displayWorks();

        categorySelect.addEventListener("change", function() {
            displayWorks();
        });

        sortSelect.addEventListener("change", function() {
            displayWorks();
        });

    })

var latitude = 35.6895;
var longitude = 139.6917;

var weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + latitude +
    "&longitude=" + longitude +
    "&current=temperature_2m,weather_code" +
    "&timezone=Asia%2FTokyo";

fetch(weatherUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var weatherCode = data.current.weather_code;
        var temperature = data.current.temperature_2m;
        showWeather(weatherCode, temperature);
    })

function showWeather(code, temperature) {

    var icon = document.getElementById("weather-icon");

    var temp = document.getElementById("weather-temp");
    temp.textContent = Number(temperature).toFixed(1) + "℃";

    if (code === 0) {
        icon.textContent = "☀️";
        document.body.className = "weather-sunny";

    } else if (code >= 1 && code <= 3) {
        icon.textContent = "☁️";
        document.body.className = "weather-cloudy";

    } else if (code === 45 || code === 48) {
        icon.textContent = "🌫️";
        document.body.className = "weather-cloudy";

    } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
        icon.textContent = "☔";
        document.body.className = "weather-rainy";

    } else if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
        icon.textContent = "❄️";
        document.body.className = "weather-snowy";

    } else if (code >= 95 && code <= 99) {
        icon.textContent = "⚡";
        document.body.className = "weather-thunder";

    } else {
        icon.textContent = "☁️";
        document.body.className = "weather-cloudy"
    }
}

var themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click", function() {
    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {
        themeButton.textContent = "ライトモード";
    } else {
        themeButton.textContent = "ダークモード";
    }
});
