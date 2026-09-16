document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       MENÚ MÓVIL
    ================================= */

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", () => {
            mainNav.classList.toggle("open");
        });

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {
                mainNav.classList.remove("open");
            });

        });
    }


    /* ================================
       AÑO AUTOMÁTICO
    ================================= */

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ================================
       ACORDEONES DE SEMANAS
    ================================= */

    const weekHeaders = document.querySelectorAll(".week-header");

    weekHeaders.forEach(header => {

        header.addEventListener("click", () => {

            const week = header.closest(".week");

            if (week) {
                week.classList.toggle("open");
            }

        });

    });


    /* ================================
       GITHUB
    ================================= */

    const githubLinks = document.querySelectorAll("#githubLink");

    githubLinks.forEach(link => {

        link.addEventListener("click", (event) => {

            event.preventDefault();

            // Reemplazaremos esta dirección cuando me pases tu GitHub.
            window.open("https://github.com/", "_blank");

        });

    });


    /* ================================
       CONTADORES DE PROGRESO
    ================================= */

    const courseCount = document.getElementById("courseCount");
    const weekCount = document.getElementById("weekCount");
    const activityCount = document.getElementById("activityCount");
    const evidenceCount = document.getElementById("evidenceCount");

    if (
        courseCount &&
        weekCount &&
        activityCount &&
        evidenceCount
    ) {

        /*
         * Estos contadores toman la información
         * directamente del HTML.
         *
         * Cuando agreguemos más cursos,
         * semanas, actividades o evidencias,
         * podremos actualizar este sistema.
         */

        courseCount.textContent =
            document.querySelectorAll(".course-card").length;

        weekCount.textContent =
            document.querySelectorAll(".week").length;

        activityCount.textContent =
            document.querySelectorAll(".activity-card").length;

        evidenceCount.textContent =
            document.querySelectorAll(".evidence-card").length;
    }

});