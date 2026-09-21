/* =====================================================================
   ACADEMIC SYSTEM — render.js
   Motor de renderizado dinámico. Construye la interfaz a partir de
   data.js y calcula todo el progreso automáticamente. No contiene
   ningún dato del portafolio: todo se lee de PORTAFOLIO (data.js).
   Requiere que data.js y script.js se carguen antes que este archivo.
   ===================================================================== */

window.SystemRender = (function () {

    /* -----------------------------------------------------------------
       HELPERS
       ----------------------------------------------------------------- */

    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function pad2(n) {
        return String(n).padStart(2, "0");
    }

    const TYPE_LABEL = {
        imagen: "IMG",
        pdf: "PDF",
        codigo: "CODE",
        otro: "FILE"
    };

    const TYPE_FILTERS = [
        { key: "todas", label: "Todas" },
        { key: "imagen", label: "Imágenes" },
        { key: "pdf", label: "PDF" },
        { key: "codigo", label: "Código" },
        { key: "otro", label: "Otros" },
        { key: "pendiente", label: "Pendientes" }
    ];

    /* -----------------------------------------------------------------
       CÁLCULO DE PROGRESO
       ----------------------------------------------------------------- */

    function statsForSemana(semana) {
        let total = 0, hechas = 0;

        (semana.actividades || []).forEach(act => {
            (act.evidencias || []).forEach(ev => {
                total++;
                if (!ev.pendiente) hechas++;
            });
        });

        return { total, hechas, configurada: (semana.actividades || []).length > 0 };
    }

    function statsForCurso(curso) {
        let semanasTotal = 0, semanasConfiguradas = 0;
        let evidenciasTotal = 0, evidenciasHechas = 0;

        curso.unidades.forEach(u => {
            u.semanas.forEach(s => {
                semanasTotal++;
                const st = statsForSemana(s);
                if (st.configurada) semanasConfiguradas++;
                evidenciasTotal += st.total;
                evidenciasHechas += st.hechas;
            });
        });

        const porcentaje = evidenciasTotal > 0
            ? Math.round((evidenciasHechas / evidenciasTotal) * 100)
            : 0;

        return {
            unidades: curso.unidades.length,
            semanasTotal, semanasConfiguradas,
            evidenciasTotal, evidenciasHechas,
            porcentaje
        };
    }

    // Agrupa los cursos por ciclo académico. Un ciclo dura sus propias
    // semanas sin importar cuántos cursos matriculados tenga (por eso
    // NO se suman las semanas de todos los cursos de un mismo ciclo).
    function groupByCiclo() {
        const groups = {};
        const order = [];

        PORTAFOLIO.cursos.forEach(curso => {
            const key = curso.ciclo || "Sin ciclo";
            if (!groups[key]) {
                groups[key] = [];
                order.push(key);
            }
            groups[key].push(curso);
        });

        return order.map(key => ({ ciclo: key, cursos: groups[key] }));
    }

    function statsGlobal() {
        const ciclos = groupByCiclo();

        let semanasTotal = 0, evidenciasTotal = 0, evidenciasHechas = 0;

        ciclos.forEach(grupo => {
            const semanasDelCiclo = Math.max(
                ...grupo.cursos.map(c => c.unidades.reduce((sum, u) => sum + u.semanas.length, 0))
            );
            semanasTotal += semanasDelCiclo;

            grupo.cursos.forEach(c => {
                const st = statsForCurso(c);
                evidenciasTotal += st.evidenciasTotal;
                evidenciasHechas += st.evidenciasHechas;
            });
        });

        const porcentaje = evidenciasTotal > 0
            ? Math.round((evidenciasHechas / evidenciasTotal) * 100)
            : 0;

        return {
            cursos: PORTAFOLIO.cursos.length,
            ciclos: ciclos.length,
            cicloActual: (PORTAFOLIO.meta && PORTAFOLIO.meta.cicloActual) || ciclos[0]?.ciclo || "—",
            semanasTotal, evidenciasTotal, evidenciasHechas, porcentaje
        };
    }

    function countsByTipo(curso) {
        const counts = { imagen: 0, pdf: 0, codigo: 0, otro: 0, pendiente: 0 };

        curso.unidades.forEach(u => u.semanas.forEach(s => (s.actividades || []).forEach(a => {
            (a.evidencias || []).forEach(ev => {
                if (ev.pendiente || !ev.tipo) counts.pendiente++;
                else if (counts[ev.tipo] !== undefined) counts[ev.tipo]++;
            });
        })));

        return counts;
    }

    /* -----------------------------------------------------------------
       RANGO DEL SISTEMA (E → S) según el progreso del curso
       ----------------------------------------------------------------- */

    function rankFor(porcentaje, evidenciasTotal) {
        if (!evidenciasTotal) return "—";
        if (porcentaje >= 100) return "S";
        if (porcentaje >= 80) return "A";
        if (porcentaje >= 60) return "B";
        if (porcentaje >= 40) return "C";
        if (porcentaje >= 20) return "D";
        return "E";
    }

    function rankBadgeHTML(rank) {
        return `<span class="rank-badge rank-${rank === "—" ? "none" : rank}">${rank}</span>`;
    }

    /* -----------------------------------------------------------------
       BARRA DE PROGRESO (HTML)
       ----------------------------------------------------------------- */

    function progressBarHTML(hechas, total, labelPrefix) {
        const pct = total > 0 ? Math.round((hechas / total) * 100) : 0;
        const complete = total > 0 && hechas === total;

        return `
            <div class="progress-label${complete ? " is-complete" : ""}">
                <span>${escapeHtml(labelPrefix || "PROGRESO")}</span>
                <strong>${complete ? "COMPLETADO" : (total > 0 ? `${hechas} / ${total}` : "SIN DATOS")}</strong>
            </div>
            <div class="progress-track">
                <div class="progress-fill${complete ? " is-complete" : ""}" style="width:${pct}%"></div>
            </div>`;
    }

    /* -----------------------------------------------------------------
       TARJETAS DE CURSO (cursos.html) — agrupadas por ciclo
       ----------------------------------------------------------------- */

    function renderCourseCards(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const ciclos = groupByCiclo();
        let globalIdx = 0;
        let html = "";

        ciclos.forEach(grupo => {
            html += `
            <div class="ciclo-group">
                <p class="ciclo-heading"><span class="dot"></span> CICLO ${escapeHtml(grupo.ciclo)}</p>
                <div class="courses-grid">
                    ${grupo.cursos.map(curso => {
                        globalIdx++;
                        const st = statsForCurso(curso);
                        const rank = rankFor(st.porcentaje, st.evidenciasTotal);

                        return `
                        <article class="course-card">
                            <div class="course-number">${pad2(globalIdx)}</div>
                            <div class="course-content">
                                <div class="course-card-top">
                                    <span class="course-tag">CURSO</span>
                                    ${rankBadgeHTML(rank)}
                                </div>
                                <h2>${escapeHtml(curso.nombre)}</h2>
                                <p>${escapeHtml(curso.descripcion || "")}</p>

                                <div class="course-stats">
                                    <span><strong>${st.unidades}</strong> unidades</span>
                                    <span><strong>${st.semanasTotal}</strong> semanas</span>
                                    <span><strong>${st.evidenciasHechas}/${st.evidenciasTotal}</strong> evidencias</span>
                                </div>

                                <div class="course-progress">
                                    ${progressBarHTML(st.evidenciasHechas, st.evidenciasTotal, "PROGRESO")}
                                </div>

                                <a href="cursos/${curso.id}.html" class="btn btn-primary">
                                    Explorar curso
                                </a>
                            </div>
                        </article>`;
                    }).join("")}
                </div>
            </div>`;
        });

        container.innerHTML = html;
    }

    /* -----------------------------------------------------------------
       BARRA DE ESTADO GLOBAL (reemplaza progreso.html, vive en cursos.html)
       ----------------------------------------------------------------- */

    function renderStatusBar(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const g = statsGlobal();

        container.innerHTML = `
            <div class="status-cell">
                <span>CICLO ACTUAL</span>
                <strong>${escapeHtml(g.cicloActual)}</strong>
            </div>
            <div class="status-cell">
                <span>CURSOS</span>
                <strong>${g.cursos}</strong>
            </div>
            <div class="status-cell">
                <span>SEMANAS DEL CICLO</span>
                <strong>${g.semanasTotal}</strong>
            </div>
            <div class="status-cell">
                <span>EVIDENCIAS</span>
                <strong>${g.evidenciasHechas}<small>/${g.evidenciasTotal}</small></strong>
            </div>
            <div class="status-cell">
                <span>PROGRESO GLOBAL</span>
                <strong>${g.porcentaje}<small>%</small></strong>
            </div>`;
    }

    /* -----------------------------------------------------------------
       EVIDENCIA → HTML de una tarjeta
       ----------------------------------------------------------------- */

    function evidenceCardHTML(ev, basePath) {
        if (ev.pendiente || !ev.archivo) {
            return `
            <div class="evidence-card is-pending" data-tipo="pendiente">
                <div class="evidence-info">
                    <div>
                        <strong>${escapeHtml(ev.nombre)}</strong>
                        <p>${escapeHtml(ev.descripcion || "Pendiente de completar")}</p>
                    </div>
                </div>
                <span class="evidence-pending-badge">PENDIENTE</span>
            </div>`;
        }

        const typeLabel = TYPE_LABEL[ev.tipo] || "FILE";
        const viewHref = `${basePath}visualizar.html?id=${encodeURIComponent(ev.id)}`;
        const downloadHref = `${basePath}${ev.archivo}`;
        const fileName = ev.archivo.split("/").pop();

        return `
        <div class="evidence-card" data-tipo="${escapeHtml(ev.tipo || "otro")}">
            <div class="evidence-info">
                <span class="evidence-type-tag">${typeLabel}</span>
                <div>
                    <strong>${escapeHtml(ev.nombre)}</strong>
                    <p>${escapeHtml(ev.descripcion || "")}</p>
                </div>
            </div>
            <div class="evidence-actions">
                <a href="${viewHref}" class="btn-small">Ver</a>
                <a href="${downloadHref}" class="btn-small" download="${escapeHtml(fileName)}">Descargar</a>
            </div>
        </div>`;
    }

    /* -----------------------------------------------------------------
       DETALLE DE CURSO (cursos/*.html)
       ----------------------------------------------------------------- */

    function renderCourseDetail(cursoId, basePath) {
        const curso = PORTAFOLIO.cursos.find(c => c.id === cursoId);

        const titleEl = document.querySelector("[data-course-title]");
        const descEl = document.querySelector("[data-course-desc]");
        const progressEl = document.querySelector("[data-course-progress]");
        const rankEl = document.querySelector("[data-course-rank]");
        const filterBarEl = document.querySelector("[data-filter-bar]");
        const syllabusEl = document.querySelector("[data-course-syllabus]");
        const root = document.querySelector("[data-course-root]");

        if (!curso) {
            if (root) {
                root.innerHTML = `
                <div class="empty-week">
                    <span>CURSO NO ENCONTRADO</span>
                    <h3>No existe información para "${escapeHtml(cursoId)}"</h3>
                    <p>Revisa que el id coincida con el registrado en data.js.</p>
                </div>`;
            }
            return;
        }

        const cst = statsForCurso(curso);
        const rank = rankFor(cst.porcentaje, cst.evidenciasTotal);

        if (titleEl) titleEl.textContent = curso.nombre;
        if (descEl) descEl.textContent = curso.descripcion || "";
        if (progressEl) {
            progressEl.innerHTML = progressBarHTML(cst.evidenciasHechas, cst.evidenciasTotal, "PROGRESO GENERAL DEL CURSO");
        }
        if (rankEl) rankEl.innerHTML = rankBadgeHTML(rank);

        if (syllabusEl) {
            let blocks = "";

            if (curso.sumilla) {
                blocks += `
                    <div class="syllabus-block">
                        <span class="syllabus-label">SUMILLA</span>
                        <p>${escapeHtml(curso.sumilla)}</p>
                    </div>`;
            }
            if (curso.competencia) {
                blocks += `
                    <div class="syllabus-block">
                        <span class="syllabus-label">COMPETENCIA</span>
                        <span class="syllabus-sub">${escapeHtml(curso.competencia.nombre)}</span>
                        <p>${escapeHtml(curso.competencia.descripcion)}</p>
                    </div>`;
            }
            if (curso.logro) {
                blocks += `
                    <div class="syllabus-block">
                        <span class="syllabus-label">LOGRO DE APRENDIZAJE</span>
                        <p>${escapeHtml(curso.logro)}</p>
                    </div>`;
            }

            if (blocks) {
                syllabusEl.innerHTML = blocks;
            } else {
                syllabusEl.remove();
            }
        }

        if (filterBarEl) {
            const counts = countsByTipo(curso);
            const total = cst.evidenciasTotal;

            filterBarEl.innerHTML = TYPE_FILTERS
                .filter(f => f.key === "todas" || counts[f.key] > 0)
                .map(f => `
                    <button type="button" class="filter-chip${f.key === "todas" ? " is-active" : ""}" data-filter-key="${f.key}">
                        ${f.label}${f.key === "todas" ? ` (${total})` : ` (${counts[f.key]})`}
                    </button>`)
                .join("");

            filterBarEl.querySelectorAll(".filter-chip").forEach(btn => {
                btn.addEventListener("click", () => {
                    filterBarEl.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("is-active"));
                    btn.classList.add("is-active");
                    applyEvidenceFilter(root, btn.dataset.filterKey);
                });
            });
        }

        let html = "";

        curso.unidades.forEach(unidad => {
            const nums = unidad.semanas.map(s => s.numero);
            const rango = nums.length ? `Semanas ${pad2(Math.min(...nums))} - ${pad2(Math.max(...nums))}` : "";

            html += `
            <section class="unit-item" data-unit>
                <button class="unit-header-toggle" type="button" aria-expanded="false">
                    <div class="unit-title">
                        <span class="unit-number">UNIDAD ${escapeHtml(unidad.numero)}</span>
                        <div>
                            <h2>${escapeHtml(unidad.titulo)}</h2>
                            <p>${escapeHtml(rango)}</p>
                        </div>
                    </div>
                    <span class="unit-icon">+</span>
                </button>
                <div class="unit-content">
                    ${unidad.semanas.map(semana => weekHTML(semana, basePath)).join("")}
                </div>
            </section>`;
        });

        if (root) root.innerHTML = html;

        attachAccordionHandlers(root);

        SystemUI.toast("COURSE LOADED");
    }

    function weekHTML(semana, basePath) {
        const st = statsForSemana(semana);
        const complete = st.total > 0 && st.hechas === st.total;

        let miniProgress = "";
        if (st.configurada) {
            miniProgress = `
                <span class="week-progress-mini${complete ? " is-complete" : ""}">
                    <span class="progress-track"><span class="progress-fill${complete ? " is-complete" : ""}" style="width:${st.total > 0 ? Math.round((st.hechas / st.total) * 100) : 0}%"></span></span>
                    ${complete ? "COMPLETO" : `${st.hechas}/${st.total}`}
                </span>`;
        }

        let bodyHtml = "";

        if (semana.temas && semana.temas.length) {
            bodyHtml += `
                <p class="topics-heading">Temas de la semana</p>
                <ul class="topic-list">
                    ${semana.temas.map(t => `<li>${escapeHtml(t)}</li>`).join("")}
                </ul>`;
        }

        if (semana.actividades && semana.actividades.length) {
            bodyHtml += semana.actividades.map((act, i) => activityHTML(act, i, basePath)).join("");
        } else {
            bodyHtml += `
                <div class="empty-week">
                    <span>SEMANA ${pad2(semana.numero)}</span>
                    <h3>Actividades por agregar</h3>
                    <p>Las actividades y evidencias de esta semana se incorporarán próximamente.</p>
                </div>`;
        }

        return `
        <div class="week-item" data-week data-week-numero="${semana.numero}" data-week-complete="${complete ? "1" : "0"}">
            <button class="week-header" type="button" aria-expanded="false">
                <span class="week-header-main">
                    Semana ${pad2(semana.numero)} — ${escapeHtml(semana.titulo)}
                </span>
                ${miniProgress}
                <span class="week-icon">+</span>
            </button>
            <div class="week-content">
                ${bodyHtml}
            </div>
        </div>`;
    }

    function activityHTML(act, index, basePath) {
        const total = (act.evidencias || []).length;
        const hechas = (act.evidencias || []).filter(e => !e.pendiente).length;

        return `
        <div class="activity-item" data-activity>
            <button class="activity-header" type="button" aria-expanded="false">
                <span>${escapeHtml(act.titulo || `Actividad ${pad2(index + 1)}`)}</span>
                <span class="activity-progress-mini">${hechas}/${total}</span>
                <span class="activity-icon">+</span>
            </button>
            <div class="activity-content">
                ${act.descripcion ? `<h3>${escapeHtml(act.descripcion)}</h3>` : ""}
                <div class="evidence-list">
                    ${(act.evidencias || []).map(ev => evidenceCardHTML(ev, basePath)).join("")}
                </div>
            </div>
        </div>`;
    }

    /* -----------------------------------------------------------------
       FILTRO POR TIPO DE EVIDENCIA
       ----------------------------------------------------------------- */

    function applyEvidenceFilter(root, tipo) {
        if (!root) return;

        root.querySelectorAll(".evidence-card").forEach(card => {
            const match = tipo === "todas" || card.dataset.tipo === tipo;
            card.classList.toggle("is-hidden-by-filter", !match);
        });

        root.querySelectorAll(".activity-item").forEach(act => {
            const cards = act.querySelectorAll(".evidence-card");
            if (!cards.length) return;
            const anyVisible = Array.from(cards).some(c => !c.classList.contains("is-hidden-by-filter"));
            act.classList.toggle("is-hidden-by-filter", !anyVisible);
        });
    }

    /* -----------------------------------------------------------------
       ACORDEONES + TOASTS DEL SISTEMA
       ----------------------------------------------------------------- */

    function attachAccordionHandlers(root) {
        if (!root) return;

        root.querySelectorAll(".unit-header-toggle").forEach(btn => {
            btn.addEventListener("click", () => {
                const unit = btn.closest(".unit-item");
                const willOpen = !unit.classList.contains("open");

                unit.classList.toggle("open");
                btn.setAttribute("aria-expanded", willOpen ? "true" : "false");

                if (willOpen) {
                    const numero = unit.querySelector(".unit-number").textContent.trim();
                    SystemUI.toast(`${numero} UNLOCKED`);
                }
            });
        });

        root.querySelectorAll(".week-header").forEach(btn => {
            btn.addEventListener("click", () => {
                const week = btn.closest(".week-item");
                const willOpen = !week.classList.contains("open");

                week.classList.toggle("open");
                btn.setAttribute("aria-expanded", willOpen ? "true" : "false");

                if (willOpen) {
                    const numero = week.dataset.weekNumero;
                    const isComplete = week.dataset.weekComplete === "1";
                    SystemUI.toast(isComplete ? "WEEK COMPLETE" : `WEEK ${pad2(numero)} ACCESS GRANTED`);
                }
            });
        });

        root.querySelectorAll(".activity-header").forEach(btn => {
            btn.addEventListener("click", () => {
                const activity = btn.closest(".activity-item");
                activity.classList.toggle("open");
                btn.setAttribute("aria-expanded", activity.classList.contains("open") ? "true" : "false");
            });
        });
    }

    /* -----------------------------------------------------------------
       BÚSQUEDA DE UNA EVIDENCIA (para visualizar.html)
       ----------------------------------------------------------------- */

    function findEvidencia(id) {
        for (const curso of PORTAFOLIO.cursos) {
            for (const unidad of curso.unidades) {
                for (const semana of unidad.semanas) {
                    for (const actividad of (semana.actividades || [])) {
                        for (const ev of (actividad.evidencias || [])) {
                            if (ev.id === id) {
                                return { curso, unidad, semana, actividad, evidencia: ev };
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    return {
        statsForSemana, statsForCurso, statsGlobal, groupByCiclo, countsByTipo,
        rankFor, rankBadgeHTML,
        progressBarHTML,
        renderCourseCards, renderStatusBar, renderCourseDetail,
        attachAccordionHandlers, applyEvidenceFilter,
        findEvidencia,
        escapeHtml, pad2, TYPE_LABEL
    };

})();
