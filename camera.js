(function () {
  const TARGETS_PATH = "./targets.mind";
  const url = new URL(window.location.href);
  const selectedSlug = url.searchParams.get("place") || "";
  const selectedPlaceRaw = selectedSlug ? window.getPlaceBySlug(selectedSlug) : null;
  const selectedPlace = selectedPlaceRaw && selectedPlaceRaw.enabled ? selectedPlaceRaw : null;

  const statusEl = document.getElementById("status");
  const startOverlay = document.getElementById("startOverlay");
  const startDescription = document.getElementById("startDescription");
  const startBtn = document.getElementById("startBtn");
  const reloadBtn = document.getElementById("reloadBtn");
  const rotateHint = document.getElementById("rotateHint");
  const videoDock = document.getElementById("videoDock");
  const videoEl = document.getElementById("arVideo");
  const videoHintEl = document.getElementById("videoHint");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const opacityControl = document.getElementById("opacityControl");
  const opacitySlider = document.getElementById("opacitySlider");
  const sceneEl = document.getElementById("scene");
  const targetsRoot = document.getElementById("targetsRoot");

  let running = false;
  let arStartedOnce = false;
  let currentIndex = null;
  let currentVideo = "";

  if (!Array.isArray(window.PLACES) || !sceneEl || !targetsRoot) {
    console.error("PLACES or scene not found");
    return;
  }

  if (selectedSlug && !selectedPlaceRaw) {
    startDescription.textContent = "Выбранный объект не найден в настройках. Будет запущен общий режим по всем меткам.";
  } else if (selectedPlaceRaw && !selectedPlace) {
    startDescription.textContent = `Для объекта «${selectedPlaceRaw.title}» видео и метки ещё не добавлены. Будет запущен общий режим.`;
  } else if (selectedPlace) {
    startDescription.textContent = `Выбран объект «${selectedPlace.title}». После запуска наводи камеру на его метки ${selectedPlace.markerStart + 1}–${selectedPlace.markerEnd + 1}.`;
  } else {
    startDescription.textContent = "Откроется общий режим. Можно наводить камеру на любую готовую метку из проекта.";
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function isMobileLike() {
    return window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  }

  function isPortrait() {
    if (window.matchMedia) return window.matchMedia("(orientation: portrait)").matches;
    return window.innerHeight > window.innerWidth;
  }

  function updateRotateHint() {
    if (!arStartedOnce) {
      rotateHint.style.display = "none";
      return;
    }
    rotateHint.style.display = isMobileLike() && isPortrait() ? "flex" : "none";
  }

  window.addEventListener("resize", updateRotateHint);
  window.addEventListener("orientationchange", updateRotateHint);

  opacitySlider.addEventListener("input", () => {
    videoEl.style.opacity = String(Number(opacitySlider.value) / 100);
  });

  function hardenInlineVideo() {
    videoEl.muted = true;
    videoEl.loop = true;
    videoEl.playsInline = true;
    videoEl.setAttribute("playsinline", "");
    videoEl.setAttribute("webkit-playsinline", "");
    videoEl.disablePictureInPicture = true;
    videoEl.setAttribute("disablePictureInPicture", "");
  }
  hardenInlineVideo();

  playPauseBtn.addEventListener("click", async () => {
    try {
      if (videoEl.paused) {
        await videoEl.play();
        playPauseBtn.textContent = "⏸ Пауза";
        videoHintEl.textContent = "Видео играет — меняй прозрачность справа";
      } else {
        videoEl.pause();
        playPauseBtn.textContent = "▶ Играть";
        videoHintEl.textContent = "Пауза";
      }
    } catch (error) {
      console.error(error);
      playPauseBtn.textContent = "▶ Играть";
      videoHintEl.textContent = "Нажми ещё раз — браузер заблокировал автозапуск";
    }
  });

  function buildTargets() {
    const maxMarkerIndex = window.getMaxMarkerIndex();
    targetsRoot.innerHTML = "";

    for (let i = 0; i <= maxMarkerIndex; i += 1) {
      const holder = document.createElement("a-entity");
      holder.setAttribute("mindar-image-target", `targetIndex: ${i}`);
      holder.addEventListener("targetFound", () => onFound(i));
      holder.addEventListener("targetLost", () => onLost(i));
      targetsRoot.appendChild(holder);
    }
  }

  async function onFound(index) {
    const place = window.getPlaceByMarkerIndex(index);
    if (!place) {
      setStatus(`Найдена метка #${index + 1}, но для неё не настроено видео.`);
      return;
    }

    if (selectedPlace && place.slug !== selectedPlace.slug) {
      setStatus(`Сейчас выбран объект «${selectedPlace.title}». Эта метка относится к «${place.title}».`);
      videoHintEl.textContent = `Нужны метки объекта «${selectedPlace.title}».`;
      return;
    }

    currentIndex = index;
    videoDock.hidden = false;
    opacityControl.style.display = "block";
    opacitySlider.value = "100";
    videoEl.style.opacity = "1";
    videoHintEl.textContent = `${place.title} — уменьши прозрачность справа`;
    setStatus(`Метка #${index + 1} найдена — ${place.title}`);

    if (currentVideo === place.video && !videoEl.paused) {
      return;
    }

    currentVideo = place.video;
    videoEl.src = place.video;

    try {
      await videoEl.play();
      playPauseBtn.textContent = "⏸ Пауза";
    } catch (error) {
      console.error(error);
      playPauseBtn.textContent = "▶ Играть";
      videoHintEl.textContent = "Нажми кнопку воспроизведения — браузер заблокировал автозапуск";
    }
  }

  function onLost(index) {
    if (index === currentIndex) {
      setStatus(`Метка #${index + 1} потеряна — видео продолжает играть.`);
      videoHintEl.textContent = "Метка потеряна, но видео продолжается";
    }
  }

  async function checkTargetsFile() {
    sceneEl.setAttribute(
      "mindar-image",
      `imageTargetSrc: ${TARGETS_PATH}; autoStart: false; uiScanning: false; uiError: false;`
    );

    try {
      const response = await fetch(TARGETS_PATH, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`targets.mind HTTP ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error(error);
      setStatus("targets.mind не загрузился. Проверь, что файл лежит рядом с camera.html.");
      alert("Файл targets.mind не загрузился. Проверь структуру проекта и публикацию на GitHub Pages.");
      return false;
    }
  }

  async function startAR() {
    if (running) return;

    const ok = await checkTargetsFile();
    if (!ok) return;

    buildTargets();
    const mindar = sceneEl.systems["mindar-image-system"];

    if (!mindar) {
      setStatus("MindAR system не найден.");
      alert("MindAR system не найден. Проверь подключение A-Frame и MindAR в camera.html.");
      return;
    }

    try {
      setStatus("Запуск камеры…");
      await mindar.start();
      running = true;
      arStartedOnce = true;
      startOverlay.style.display = "none";
      setStatus(selectedPlace ? `Камера запущена — ищу метки объекта «${selectedPlace.title}».` : "Камера запущена — наведи на метку.");
      updateRotateHint();
    } catch (error) {
      console.error(error);
      setStatus(`Не удалось запустить камеру: ${error?.name || "ошибка"}`);
      alert("Не удалось запустить камеру. Проверь разрешение браузера и убедись, что камера не занята.");
    }
  }

  reloadBtn.addEventListener("click", () => window.location.reload());
  startBtn.addEventListener("click", startAR);
  setStatus("Нажмите «Запустить AR»");
})();