(function () {
  const grid = document.getElementById("placeGrid");
  const prevBtn = document.getElementById("placesPrev");
  const nextBtn = document.getElementById("placesNext");

  if (!grid || !Array.isArray(window.PLACES)) return;

  const cardsHtml = window.PLACES.map((place) => {
    const primaryButton = place.enabled
      ? `<a class="btn btn--primary" href="camera.html?place=${encodeURIComponent(place.slug)}">Запустить камеру</a>`
      : `<button class="btn btn--disabled" type="button" disabled>Скоро</button>`;

    const markerText = place.enabled && typeof place.markerStart === "number" && typeof place.markerEnd === "number"
      ? `Метки: ${place.markerStart + 1}–${place.markerEnd + 1}`
      : "Метки ещё не добавлены";

    return `
      <article class="placeCard">
        <div class="placeCard__media">
          <img class="placeCard__img" src="${place.image}" alt="${place.title}" loading="lazy">
        </div>
        <div class="placeCard__body">
          <div class="placeCard__top">
            <span class="placeCard__tag">${place.tag}</span>
            <span class="placeCard__meta">${markerText}</span>
          </div>
          <h3 class="placeCard__title">${place.title}</h3>
          <p class="placeCard__desc">${place.description}</p>
          <div class="placeCard__actions">
            ${primaryButton}
            <a class="btn btn--ghost" href="#how">Инструкция</a>
          </div>
        </div>
      </article>
    `;
  }).join("");

  grid.innerHTML = cardsHtml;

  function getCardStep() {
    const firstCard = grid.querySelector(".placeCard");
    if (!firstCard) return grid.clientWidth * 0.9;

    const gridStyle = window.getComputedStyle(grid);
    const gap = parseFloat(gridStyle.columnGap || gridStyle.gap || "14");
    return firstCard.getBoundingClientRect().width + gap;
  }

  function arrowsAllowed() {
    return window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 701px)").matches;
  }

  function updateButtons() {
    if (!prevBtn || !nextBtn) return;

    const shouldShow = arrowsAllowed() && grid.scrollWidth > grid.clientWidth + 8;

    prevBtn.hidden = !shouldShow;
    nextBtn.hidden = !shouldShow;

    if (!shouldShow) return;

    const maxScroll = Math.max(0, grid.scrollWidth - grid.clientWidth - 2);
    prevBtn.disabled = grid.scrollLeft <= 2;
    nextBtn.disabled = grid.scrollLeft >= maxScroll;
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      grid.scrollBy({ left: -getCardStep(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      grid.scrollBy({ left: getCardStep(), behavior: "smooth" });
    });
  }

  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;
  let suppressClick = false;

  function canDragWithMouse() {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }

  grid.addEventListener("mousedown", (event) => {
    if (!canDragWithMouse()) return;
    if (event.button !== 0) return;

    isDragging = true;
    moved = false;
    startX = event.pageX;
    startScrollLeft = grid.scrollLeft;
    grid.classList.add("isDragging");
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    const dx = event.pageX - startX;

    if (Math.abs(dx) > 5) {
      moved = true;
    }

    grid.scrollLeft = startScrollLeft - dx;
  });

  function stopDragging() {
    if (!isDragging) return;

    isDragging = false;
    grid.classList.remove("isDragging");

    if (moved) {
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 0);
    }

    updateButtons();
  }

  window.addEventListener("mouseup", stopDragging);
  grid.addEventListener("mouseleave", stopDragging);

  grid.addEventListener("click", (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  grid.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  grid.addEventListener("scroll", updateButtons, { passive: true });
  window.addEventListener("resize", updateButtons);

  updateButtons();
})();
