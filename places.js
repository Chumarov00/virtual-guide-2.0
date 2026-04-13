window.TARGET_GROUPS = {
  homes: {
    slug: "homes",
    title: "Дома",
    targetFile: "./home.mind"
  },
  monuments: {
    slug: "monuments",
    title: "Памятники",
    targetFile: "./monuments.mind"
  }
};

window.PLACES = [
  {
    slug: "bulygin",
    title: "Дом купца Булыгина",
    tag: "Архитектура",
    image: "assets/images/bulygin.jpg",
    video: "assets/videos/bulygin.mp4",
    group: "homes",
    markerStart: 0,
    markerEnd: 9,
    enabled: true,
    description: "Исторический особняк в Йошкар-Оле. Сейчас здание связано с музейной историей города и используется как одна из точек маршрута виртуального гида."
  },
  {
    slug: "naumov",
    title: "Дом купца Наумова",
    tag: "Архитектура",
    image: "assets/images/naumov.jpg",
    video: "assets/videos/naumov.mp4",
    group: "homes",
    markerStart: 10,
    markerEnd: 21,
    enabled: true,
    description: "Первый этаж дома купца Наумова каменный, второй — деревянный, украшен резьбой. На первом этаже располагалась торговая лавка, на втором — жилые комнаты."
  },
  {
    slug: "pchelin",
    title: "Дом купца Пчелина",
    tag: "Архитектура",
    image: "assets/images/pchelin.jpg",
    video: "assets/videos/pchelin.mp4",
    group: "homes",
    markerStart: 22,
    markerEnd: 28,
    enabled: true,
    description: "Дом купца Пчелина находится в исторической части Йошкар-Олы и относится к числу старых городских зданий, которые помогают показать прошлое города через AR-сцену."
  },
  {
    slug: "pushkin",
    title: "Памятник А. С. Пушкину и Евгению Онегину",
    tag: "Памятник",
    image: "assets/images/Pushkin.jpg",
    video: "assets/videos/pishkin.mp4",
    group: "monuments",
    markerStart: 15,
    markerEnd: 26,
    enabled: true,
    description: "Бронзовая композиция изображает поэта Александра Сергеевича Пушкина в полный рост в окружении его персонажа — Евгения Онегина."
  },
  {
    slug: "catherine",
    title: "Памятник Елизавете Петровне",
    tag: "Памятник",
    image: "assets/images/Catherine.jpg",
    video: "assets/videos/catherine.mp4",
    group: "monuments",
    markerStart: 0,
    markerEnd: 14,
    enabled: true,
    description: "Бронзовая скульптура изображает императрицу верхом на коне. Выбор места не случаен: Елизавета Петровна внесла вклад в развитие образования и просвещения, а памятник установлен у образовательного учреждения."
  },
  {
    slug: "chulkov",
    title: "Усадьба Чулкова",
    tag: "Музей",
    image: "assets/images/chulkov.jpg",
    video: "",
    group: "",
    markerStart: null,
    markerEnd: null,
    enabled: false,
    description: "Усадьба Чулкова — дом из красного кирпича с выразительной кладкой. Сейчас карточка подготовлена, но AR-видео и метки для этой точки ещё не подключены."
  },
  {
    slug: "palantai",
    title: "Музыкальное училище им. И. С. Палантая",
    tag: "Культура",
    image: "assets/images/palantai.jpg",
    video: "",
    group: "",
    markerStart: null,
    markerEnd: null,
    enabled: false,
    description: "Карточка подготовлена для будущего расширения маршрута. Видео и метки для этой локации пока не добавлены."
  }
];

window.getPlaceBySlug = function getPlaceBySlug(slug) {
  return window.PLACES.find((place) => place.slug === slug) || null;
};

window.getGroupBySlug = function getGroupBySlug(slug) {
  if (!slug) return null;
  return window.TARGET_GROUPS[slug] || null;
};

window.getPlacesByGroup = function getPlacesByGroup(groupSlug) {
  return window.PLACES.filter((place) => place.enabled && place.group === groupSlug);
};

window.getPlaceByMarkerIndex = function getPlaceByMarkerIndex(groupSlug, index) {
  return (
    window.PLACES.find((place) => {
      if (!place.enabled) return false;
      if (place.group !== groupSlug) return false;
      if (typeof place.markerStart !== "number" || typeof place.markerEnd !== "number") return false;
      return index >= place.markerStart && index <= place.markerEnd;
    }) || null
  );
};

window.getMaxMarkerIndexForGroup = function getMaxMarkerIndexForGroup(groupSlug) {
  return window.PLACES.reduce((max, place) => {
    if (!place.enabled) return max;
    if (place.group !== groupSlug) return max;
    if (typeof place.markerEnd !== "number") return max;
    return Math.max(max, place.markerEnd);
  }, -1);
};
