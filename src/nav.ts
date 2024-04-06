document
  .getElementById("scrollButton")
  ?.addEventListener("click", scrollToMain);

function scrollToMain(e: MouseEvent) {
  e.preventDefault();
  const top = document.getElementById("main")?.offsetTop;

  window.scrollTo({
    top: top,
    behavior: "smooth",
  });
}
