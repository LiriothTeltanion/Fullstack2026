// Filter the project cards by their data-tags attribute.
const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(b => {
      b.classList.toggle("is-active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });

    projects.forEach(project => {
      const tags = project.dataset.tags.split(" ");
      project.hidden = filter !== "all" && !tags.includes(filter);
    });
  });
});
