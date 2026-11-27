(function () {
  const data = window.SITE_DATA;
  if (!data) return;
  const menuBtn = document.getElementById("menuBtn");
  const mainNav = document.getElementById("mainNav");
  if (menuBtn && mainNav) {
    menuBtn.addEventListener("click", () => {
      const open = mainNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    mainNav.querySelectorAll("a").forEach((l) => l.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  const projectGrid = document.getElementById("projectGrid");
  if (projectGrid && Array.isArray(data.projects)) {
    projectGrid.innerHTML = data.projects.map((p) => `
      <article class="project-card">
        <div class="project-media"><img src="${p.image}" alt="${p.alt}" width="1400" height="980" loading="lazy"></div>
        <div class="project-body"><div class="project-meta"><span>${p.category}</span><span>${p.location}</span></div><h3>${p.title}</h3><p>${p.summary}</p></div>
      </article>`).join("");
  }

  const servicePanel = document.getElementById("servicePanel");
  const serviceTabs = document.querySelectorAll(".service-tab");
  function renderService(key) {
    const svc = data.services && data.services[key];
    if (!svc || !servicePanel) return;
    servicePanel.innerHTML = `
      <div class="service-panel-top"><span class="service-badge">${svc.badge}</span><span class="service-meta-line">${svc.eyebrow}</span></div>
      <h3>${svc.title}</h3>
      <p>${svc.desc}</p>
      <ul class="service-points">${svc.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>
      <div class="service-panel-footer"><span class="service-meta-line">${svc.meta}</span><a href="#offert" class="btn btn-accent">${svc.ctaText}</a></div>`;
  }
  if (serviceTabs.length) {
    renderService("bandtackning");
    serviceTabs.forEach((tab) => tab.addEventListener("click", () => {
      serviceTabs.forEach((t) => { const a = t === tab; t.classList.toggle("is-active", a); t.setAttribute("aria-selected", String(a)); });
      renderService(tab.getAttribute("data-service"));
    }));
  }

  const rotSlider = document.getElementById("rotSlider");
  const fmtKr = (n) => `${Math.round(n).toLocaleString("sv-SE")} kr`;
  function updateRot() {
    if (!rotSlider) return;
    const gross = Number(rotSlider.value) || 40000;
    const ded = Math.min(gross * 0.3, 50000);
    document.getElementById("rotInputDisplay").textContent = fmtKr(gross);
    document.getElementById("rotGross").textContent = fmtKr(gross);
    document.getElementById("rotDeduction").textContent = `−${fmtKr(ded)}`;
    document.getElementById("rotNet").textContent = fmtKr(gross - ded);
  }
  if (rotSlider) { rotSlider.addEventListener("input", updateRot); updateRot(); }

  const faqList = document.getElementById("faqList");
  if (faqList && Array.isArray(data.faqs)) {
    faqList.innerHTML = data.faqs.map((item, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${item.q}</summary><p>${item.a}</p></details>`).join("");
  }

  const quoteForm = document.getElementById("quoteForm");
  const formStatus = document.getElementById("formStatus");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("qName")?.value.trim();
      const phone = document.getElementById("qPhone")?.value.trim();
      const email = document.getElementById("qEmail")?.value.trim();
      const service = document.getElementById("qService")?.value || "Plåtarbete";
      const message = document.getElementById("qMessage")?.value.trim();
      if (!name || !phone || !message) { formStatus.textContent = "Fyll i namn, telefonnummer och en kort beskrivning."; return; }
      formStatus.textContent = "Tack! Ditt e-postprogram öppnas nu — eller ring 073-027 60 77.";
      window.location.href = `mailto:${data.company.email}?subject=${encodeURIComponent(`Offertförfrågan: ${service} — ${name}`)}&body=${encodeURIComponent(`Namn: ${name}\nTelefon: ${phone}\nE-post: ${email || "-"}\nUppdrag: ${service}\n\n${message}`)}`;
    });
  }
})();
