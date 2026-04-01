(function () {
  const burger = document.querySelector(".burger");
  const drawer = document.querySelector(".drawer");
  const helpBtn = document.getElementById("helpBtn");

  if (burger && drawer) {
    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!isOpen));
      drawer.hidden = isOpen;
    });

    drawer.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      burger.setAttribute("aria-expanded", "false");
      drawer.hidden = true;
    });
  }

  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      alert(
        "Как пользоваться:\n\n" +
        "1. Открой нужный объект или общий режим.\n" +
        "2. Разреши доступ к камере.\n" +
        "3. Наведи телефон на метку.\n" +
        "4. Уменьшай прозрачность видео справа.\n\n" +
        "Если видео не стартовало, нажми кнопку воспроизведения поверх видео."
      );
    });
  }
})();