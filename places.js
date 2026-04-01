window.PLACES = [
  {
    slug: "naumov",
    title: "Дом купца Наумова",
    tag: "Архитектура",
    image: "assets/images/naumov.jpg",
    video: "assets/videos/naumov.mp4",
    markerStart: 8,
    markerEnd: 14,
    enabled: true,
    description: "Первый этаж дома купца Наумова каменный, второй — деревянный, украшен резьбой. На первом этаже располагалась торговая лавка, на втором — жилые комнаты."
  },
  {
    slug: "bulygin",
    title: "Дом купца Булыгина",
    tag: "Архитектура",
    image: "assets/images/bulygin.jpg",
    video: "assets/videos/bulygin.mp4",
    markerStart: 0,
    markerEnd: 7,
    enabled: true,
    description: "Исторический особняк в Йошкар-Оле. Сейчас здание связано с музейной историей города и используется как одна из точек маршрута виртуального гида."
  },
  {
    slug: "pchelin",
    title: "Дом купца Пчелина",
    tag: "Архитектура",
    image: "assets/images/pchelin.jpg",
    video: "assets/videos/pchelin.mp4",
    markerStart: 15,
    markerEnd: 24,
    enabled: true,
    description: "Дом купца Пчелина находится в исторической части Йошкар-Олы и относится к числу старых городских зданий, которые помогают показать прошлое города через AR-сцену."
  },
  {
    slug: "chulkov",
    title: "Усадьба Чулкова",
    tag: "Музей",
    image: "assets/images/chulkov.jpg",
    video: "",
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
    markerStart: null,
    markerEnd: null,
    enabled: false,
    description: "Карточка подготовлена для будущего расширения маршрута. Видео и метки для этой локации пока не добавлены."
  }
];

window.getPlaceBySlug = function getPlaceBySlug(slug) {
  return window.PLACES.find((place) => place.slug === slug) || null;
};

window.getPlaceByMarkerIndex = function getPlaceByMarkerIndex(index) {
  return (
    window.PLACES.find((place) => {
      if (!place.enabled) return false;
      if (typeof place.markerStart !== "number" || typeof place.markerEnd !== "number") return false;
      return index >= place.markerStart && index <= place.markerEnd;
    }) || null
  );
};

window.getMaxMarkerIndex = function getMaxMarkerIndex() {
  return window.PLACES.reduce((max, place) => {
    if (!place.enabled || typeof place.markerEnd !== "number") return max;
    return Math.max(max, place.markerEnd);
  }, -1);
};