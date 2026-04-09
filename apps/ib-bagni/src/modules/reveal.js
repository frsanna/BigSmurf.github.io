/**
 * Attach reveal animation observers to all not-yet-visible elements inside a scope.
 *
 * @param {ParentNode} [scope=document]
 * @returns {void}
 */
export function observeRevealItems(scope = document) {
  const revealItems = scope.querySelectorAll("[data-reveal]:not(.is-visible)");

  if (!revealItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}
