const menu = document.querySelector("#menu");
const drawer = document.querySelector("#drawer");
menu?.addEventListener("click", () => {
  const on = drawer.classList.toggle("on");
  menu.setAttribute("aria-expanded", on ? "true" : "false");
});
drawer?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => drawer.classList.remove("on")));

const buttons = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-cat]")];
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.toggle("on", b === btn));
    const id = btn.dataset.filter;
    cards.forEach((card) => {
      const show =
        id === "all" ||
        (id === "featured" && card.dataset.feat === "1") ||
        card.dataset.cat === id;
      card.hidden = !show;
    });
  });
});
