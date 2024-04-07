document
  .getElementById("scrollButton")
  ?.addEventListener("click", scrollToMain);

function scrollToMain(e: MouseEvent) {
  e.preventDefault();
  window.scrollTo({
    top: document.getElementById("main")?.offsetTop,
    behavior: "smooth",
  });
}
