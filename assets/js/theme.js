(() => {
  const themeCycle = ["light", "dark", "system"];
  const iconIds = {
    light: "light-toggle-light",
    dark: "light-toggle-dark",
    system: "light-toggle-system"
  };

  function getThemeSetting() {
    const stored = localStorage.getItem("theme");
    return themeCycle.includes(stored) ? stored : "system";
  }

  function getComputedTheme() {
    const setting = getThemeSetting();
    return setting === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : setting;
  }

  function applyTheme() {
    const setting = getThemeSetting();
    const computed = getComputedTheme();

    document.documentElement.setAttribute("data-theme-setting", setting);
    document.documentElement.setAttribute("data-theme", computed);

    // Transition
    document.documentElement.classList.add("transition");
    setTimeout(() => document.documentElement.classList.remove("transition"), 300);

    // Toggle dark table style
    document.querySelectorAll("table").forEach((t) =>
      t.classList.toggle("table-dark", computed === "dark")
    );

    // Optional: Update medium zoom
    if (typeof medium_zoom !== "undefined") {
      medium_zoom.update({
        background: getComputedStyle(document.documentElement).getPropertyValue("--global-bg-color") + "ee"
      });
    }

    // Optional: Reinit particles
    if (typeof initParticles === "function") initParticles();

    // === ICON TOGGLE ===
    for (const key in iconIds) {
      const el = document.getElementById(iconIds[key]);
      if (el) {
        el.style.display = (key === setting) ? "inline-block" : "none";
      }
    }
  }

  function toggleThemeSetting() {
    const current = getThemeSetting();
    const next = themeCycle[(themeCycle.indexOf(current) + 1) % themeCycle.length];
    localStorage.setItem("theme", next);
    applyTheme();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("light-toggle");
    if (toggleBtn) toggleBtn.addEventListener("click", toggleThemeSetting);
    applyTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
  });
})();
