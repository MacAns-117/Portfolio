const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("menuBtn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
}
navLinks.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

const buttons = document.querySelectorAll("#filters button");
const cards = document.querySelectorAll("#grid .card");

function applyFilter(f) {
  cards.forEach((card) => {
    const cat = card.dataset.cat;
    const feat = card.dataset.feat === "1";
    let show = false;
    if (f === "all") show = true;
    else if (f === "featured") show = feat;
    else show = cat === f;
    card.classList.toggle("hidden", !show);
  });
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    buttons.forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    applyFilter(btn.dataset.filter);
  });
});

applyFilter("featured");
