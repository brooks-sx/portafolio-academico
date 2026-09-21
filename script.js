/* =====================================================================
   ACADEMIC SYSTEM — script.js
   Utilidades generales: menú móvil, año del footer, enlace de GitHub,
   secuencia de arranque del sistema (en todas las páginas) y el
   sistema de notificaciones (toasts). Depende de data.js (debe ir
   antes en el HTML).
   ===================================================================== */

window.SystemUI = (function () {

    /* -----------------------------------------------------------------
       TOASTS
       ----------------------------------------------------------------- */

    let toastLayer = null;

    function ensureToastLayer() {
        if (toastLayer) return toastLayer;

        toastLayer = document.createElement("div");
        toastLayer.className = "system-toasts";
        toastLayer.setAttribute("aria-live", "polite");
        document.body.appendChild(toastLayer);

        return toastLayer;
    }

    function toast(message) {
        const layer = ensureToastLayer();

        const el = document.createElement("div");
        el.className = "system-toast";
        el.textContent = message;

        layer.appendChild(el);

        window.setTimeout(() => {
            el.remove();
        }, 2500);
    }

    /* -----------------------------------------------------------------
       MENÚ MÓVIL
       ----------------------------------------------------------------- */

    function initMobileMenu() {
        const menuToggle = document.getElementById("menuToggle");
        const nav = document.querySelector(".nav");

        if (!menuToggle || !nav) return;

        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("open");

            const isOpen = nav.classList.contains("open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    /* -----------------------------------------------------------------
       AÑO DEL FOOTER
       ----------------------------------------------------------------- */

    function initFooterYear() {
        const year = new Date().getFullYear();

        document.querySelectorAll("#year, #currentYear").forEach((el) => {
            el.textContent = year;
        });
    }

    /* -----------------------------------------------------------------
       ENLACE DE GITHUB (toma la URL real desde data.js)
       ----------------------------------------------------------------- */

    function initGithubLink() {
        const url = (window.PORTAFOLIO && PORTAFOLIO.meta && PORTAFOLIO.meta.github)
            ? PORTAFOLIO.meta.github
            : "https://github.com/";

        document.querySelectorAll("#githubLink").forEach((link) => {
            link.setAttribute("href", url);
            link.setAttribute("target", "_blank");
            link.setAttribute("rel", "noopener");
        });
    }

    /* -----------------------------------------------------------------
       DATOS DEL ESTUDIANTE (nombre / carrera / universidad en header y footer)
       ----------------------------------------------------------------- */

    function initMetaText() {
        if (!window.PORTAFOLIO || !PORTAFOLIO.meta) return;
        const meta = PORTAFOLIO.meta;

        document.querySelectorAll("[data-meta='nombre']").forEach(el => el.textContent = meta.nombre);
        document.querySelectorAll("[data-meta='carrera']").forEach(el => el.textContent = meta.carrera);
        document.querySelectorAll("[data-meta='universidad']").forEach(el => el.textContent = meta.universidad);
        document.querySelectorAll("[data-meta='universidadSigla']").forEach(el => el.textContent = meta.universidadSigla);
        document.querySelectorAll("[data-meta='cicloActual']").forEach(el => el.textContent = meta.cicloActual);
    }

    /* -----------------------------------------------------------------
       BOOT SEQUENCE — se inyecta en TODAS las páginas.
       Efecto de escritura + contador de porcentaje, con una etiqueta de
       "módulo" distinta según la página (data-boot-label en <body>).
       ----------------------------------------------------------------- */

    function typeInto(el, text, speed) {
        return new Promise((resolve) => {
            el.textContent = "";
            let i = 0;
            const timer = window.setInterval(() => {
                el.textContent += text.charAt(i);
                i++;
                if (i >= text.length) {
                    window.clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    function runBoot() {
        // Evita duplicar la pantalla de arranque si el HTML ya trae una.
        if (document.getElementById("bootScreen")) return;

        const moduleLabel = document.body.dataset.bootLabel || "SISTEMA ACADÉMICO";

        const screen = document.createElement("div");
        screen.className = "boot-screen";
        screen.id = "bootScreen";
        screen.innerHTML = `
            <div class="boot-content">
                <div class="boot-glyph"></div>
                <div class="boot-percent" id="bootPercent">0%</div>
                <div class="boot-line" id="bootLine"></div>
                <div class="boot-module">MÓDULO: ${moduleLabel}</div>
                <div class="boot-bar"><div class="boot-bar-fill"></div></div>
            </div>`;
        document.body.appendChild(screen);

        const line = document.getElementById("bootLine");
        const percentEl = document.getElementById("bootPercent");

        // Contador de porcentaje sincronizado con la barra (~1100ms)
        const start = performance.now();
        const duration = 1100;
        function tickPercent(now) {
            const progress = Math.min(1, (now - start) / duration);
            percentEl.textContent = Math.round(progress * 100) + "%";
            if (progress < 1) {
                window.requestAnimationFrame(tickPercent);
            }
        }
        window.requestAnimationFrame(tickPercent);

        (async () => {
            await typeInto(line, "SYSTEM INITIALIZING", 26);
            await new Promise(r => window.setTimeout(r, 200));
            await typeInto(line, "ACADEMIC SYSTEM ONLINE", 20);
            await new Promise(r => window.setTimeout(r, 320));

            screen.classList.add("is-hidden");
            window.setTimeout(() => screen.remove(), 550);
        })();
    }

    /* -----------------------------------------------------------------
       INIT GENERAL (se ejecuta en todas las páginas)
       ----------------------------------------------------------------- */

    document.addEventListener("DOMContentLoaded", () => {
        initMobileMenu();
        initFooterYear();
        initGithubLink();
        initMetaText();
        runBoot();
    });

    return { toast };

})();
