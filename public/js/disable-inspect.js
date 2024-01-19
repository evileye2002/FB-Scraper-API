export function disableInspect() {
  document.addEventListener("keydown", (e) => {
    const isInspecting =
      e.keyCode === 123 ||
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
      (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
      (e.ctrlKey && e.shiftKey && e.keyCode === 74);

    if (isInspecting) e.preventDefault();
  });

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}
