/* =====================================================================
   ACADEMIC SYSTEM — visualizar.js
   Lógica específica de visualizar.html. Lee el parámetro ?id= de la URL,
   busca la evidencia en PORTAFOLIO (data.js) y construye el visor según
   el tipo de archivo. Página única y reutilizable para todas las
   evidencias del portafolio (regla: nunca crear una página por trabajo).
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const panel = document.getElementById("viewerPanel");
    const breadcrumb = document.getElementById("breadcrumb");
    const backLink = document.getElementById("backLink");

    const found = id ? SystemRender.findEvidencia(id) : null;

    if (!found) {
        renderNotFound(panel, breadcrumb);
        return;
    }

    const { curso, unidad, semana, actividad, evidencia } = found;

    document.title = `${evidencia.nombre} | Academic System`;

    backLink.textContent = `← Volver a ${curso.nombre}`;
    backLink.setAttribute("href", `cursos/${curso.id}.html`);

    breadcrumb.innerHTML = [
        escapeAndWrap(curso.nombre),
        escapeAndWrap(`UNIDAD ${unidad.numero}`),
        escapeAndWrap(`Semana ${SystemRender.pad2(semana.numero)}`),
        escapeAndWrap(actividad.titulo)
    ].join('<span class="sep">›</span>');

    panel.innerHTML = buildPanelHTML(evidencia);

    wireUpViewer(evidencia);

    SystemUI.toast("EVIDENCE LOADED");

    function escapeAndWrap(text) {
        return `<strong>${SystemRender.escapeHtml(text)}</strong>`;
    }
});


function renderNotFound(panel, breadcrumb) {
    if (breadcrumb) breadcrumb.innerHTML = "";

    panel.innerHTML = `
        <div class="viewer-empty">
            <span class="eyebrow"><span class="dot"></span> EVIDENCE NOT FOUND</span>
            <h1>No se encontró esta evidencia</h1>
            <p>El enlace puede ser incorrecto o el archivo aún no ha sido registrado en el sistema.</p>
            <a href="cursos.html" class="btn btn-primary">Volver a mis cursos</a>
        </div>`;
}


function buildPanelHTML(ev) {
    const typeLabel = SystemRender.TYPE_LABEL[ev.tipo] || "FILE";
    const fileName = ev.archivo.split("/").pop();
    const ext = fileName.includes(".") ? fileName.split(".").pop().toUpperCase() : "?";

    let stageHtml = "";
    let footExtra = "";

    if (ev.tipo === "imagen") {
        const displaySrc = ev.preview || ev.archivo;
        stageHtml = `
            <div class="zoom-wrap">
                <img id="viewerImage" src="${displaySrc}" alt="${SystemRender.escapeHtml(ev.nombre)}">
            </div>`;
        footExtra = `
            <div class="zoom-controls">
                <button type="button" class="btn-small" id="zoomOut">− Reducir</button>
                <button type="button" class="btn-small" id="zoomFit">Ajustar</button>
                <button type="button" class="btn-small" id="zoomIn">+ Ampliar</button>
            </div>`;
    } else if (ev.tipo === "pdf") {
        stageHtml = `<iframe class="viewer-pdf" src="${ev.archivo}" title="${SystemRender.escapeHtml(ev.nombre)}"></iframe>`;
    } else if (ev.tipo === "codigo") {
        stageHtml = `
            <div class="viewer-code-panel" style="width:100%">
                <div class="viewer-code-bar">
                    <span></span><span></span><span></span>
                </div>
                <pre class="viewer-code" id="codeContent">Cargando contenido…</pre>
            </div>`;
    } else {
        stageHtml = `
            <div class="viewer-file-info">
                <div class="file-icon">${ext}</div>
                <p><strong>${SystemRender.escapeHtml(fileName)}</strong></p>
                <p id="fileSizeInfo">Calculando tamaño…</p>
            </div>`;
    }

    return `
        <div class="viewer-panel-head">
            <div>
                <h1>${SystemRender.escapeHtml(ev.nombre)}</h1>
                ${ev.descripcion ? `<p>${SystemRender.escapeHtml(ev.descripcion)}</p>` : ""}
            </div>
            <span class="viewer-type-tag">${typeLabel}</span>
        </div>
        <div class="viewer-stage">
            ${stageHtml}
        </div>
        <div class="viewer-panel-foot">
            ${footExtra || "<span></span>"}
            <div class="evidence-actions">
                <button type="button" class="btn-small" id="copyLinkBtn">Copiar enlace</button>
                <a href="${ev.archivo}" class="btn-small" download="${SystemRender.escapeHtml(fileName)}">Descargar</a>
            </div>
        </div>`;
}


function wireUpViewer(ev) {

    const copyBtn = document.getElementById("copyLinkBtn");
    if (copyBtn) {
        copyBtn.addEventListener("click", async () => {
            const url = window.location.href;
            try {
                await navigator.clipboard.writeText(url);
            } catch (err) {
                const helper = document.createElement("textarea");
                helper.value = url;
                helper.style.position = "fixed";
                helper.style.opacity = "0";
                document.body.appendChild(helper);
                helper.select();
                document.execCommand("copy");
                helper.remove();
            }
            const original = copyBtn.textContent;
            copyBtn.textContent = "¡Copiado!";
            SystemUI.toast("LINK COPIED");
            window.setTimeout(() => { copyBtn.textContent = original; }, 1800);
        });
    }

    if (ev.tipo === "imagen") {
        const img = document.getElementById("viewerImage");
        const wrap = img.closest(".zoom-wrap");

        // factor === null significa "modo ajustado" (lo controla el CSS solo).
        // Cualquier otro valor es un múltiplo real del tamaño NATURAL de la
        // imagen, aplicado en píxeles (no en % — un % ahí no tiene una base
        // fiable para calcularse y por eso antes no hacía nada visible).
        let factor = null;

        function fitFactor() {
            const nw = img.naturalWidth || 1;
            const nh = img.naturalHeight || 1;
            const maxW = wrap.clientWidth || nw;
            const maxH = window.innerHeight * 0.65;
            return Math.min(maxW / nw, maxH / nh, 1);
        }

        function render() {
            if (factor === null || !img.naturalWidth) {
                img.style.width = "";
                img.style.height = "";
                wrap.classList.remove("is-zoomed");
                wrap.scrollLeft = 0;
                wrap.scrollTop = 0;
                return;
            }
            img.style.width = Math.round(img.naturalWidth * factor) + "px";
            img.style.height = "auto";
            wrap.classList.toggle("is-zoomed", factor > fitFactor() + 0.001);

            // Centrado real por scroll: con imágenes más anchas que el
            // visor, centrar con CSS (text-align/flex) queda descuadrado
            // hacia un lado. Leer scrollWidth/clientWidth aquí ya fuerza
            // el reflow, así que estos valores están actualizados.
            wrap.scrollLeft = (wrap.scrollWidth - wrap.clientWidth) / 2;
            wrap.scrollTop = 0;
        }

        function zoomIn() {
            const base = factor === null ? fitFactor() : factor;
            factor = Math.min(base * 1.35, fitFactor() * 4);
            render();
        }

        function zoomOut() {
            const base = factor === null ? fitFactor() : factor;
            const next = base / 1.35;
            factor = next <= fitFactor() * 1.02 ? null : next;
            render();
        }

        function zoomFit() {
            factor = null;
            render();
        }

        document.getElementById("zoomIn").addEventListener("click", zoomIn);
        document.getElementById("zoomOut").addEventListener("click", zoomOut);
        document.getElementById("zoomFit").addEventListener("click", zoomFit);

        // Click directo sobre la imagen, como al previsualizar en Drive:
        // un clic acerca, otro clic vuelve a ajustar.
        img.addEventListener("click", () => {
            if (factor === null) {
                factor = fitFactor() * 2;
                render();
            } else {
                zoomFit();
            }
        });

        if (img.complete && img.naturalWidth) {
            render();
        } else {
            img.addEventListener("load", render, { once: true });
        }
    }

    if (ev.tipo === "codigo") {
        fetch(ev.archivo)
            .then(res => {
                if (!res.ok) throw new Error("No se pudo leer el archivo");
                return res.text();
            })
            .then(text => {
                document.getElementById("codeContent").textContent = text;
            })
            .catch(() => {
                document.getElementById("codeContent").textContent =
                    "No se pudo cargar la vista previa del código. Usa el botón Descargar para verlo.";
            });
    }

    if (ev.tipo === "otro") {
        fetch(ev.archivo, { method: "HEAD" })
            .then(res => {
                const size = res.headers.get("content-length");
                const label = document.getElementById("fileSizeInfo");
                if (size) {
                    const kb = Math.round(parseInt(size, 10) / 1024);
                    label.textContent = kb > 1024
                        ? `${(kb / 1024).toFixed(1)} MB`
                        : `${kb} KB`;
                } else {
                    label.textContent = "Tamaño no disponible";
                }
            })
            .catch(() => {
                const label = document.getElementById("fileSizeInfo");
                if (label) label.textContent = "Tamaño no disponible";
            });
    }
}
