(function () {
  const grid = document.getElementById("placeGrid");
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
})();