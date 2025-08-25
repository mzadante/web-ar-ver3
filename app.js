document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-ar-button");
  const startScreen = document.getElementById("start-screen");
  const arScene = document.getElementById("ar-scene");
  const overlay = document.getElementById("ui-overlay");
  const instructions = document.getElementById("instructions");
  const statusMessage = document.getElementById("status-message");
  const controls = document.getElementById("controls");
  const distanceUpButton = document.getElementById("distance-up");
  const distanceDownButton = document.getElementById("distance-down");
  const distanceValueSpan = document.getElementById("distance-value");

  // Referencias a los marcadores y videos
  const pizzaMarker = document.getElementById("pizza-marker");
  const pizza2Marker = document.getElementById("pizza2-marker");

  const videoPizza = document.getElementById("video-entidad-pizza");
  const videoPizza2 = document.getElementById("video-entidad-pizza2");

  // Variables para controlar la visibilidad y distancia del video
  let videoVisible = null;
  let videoDistance = 0;

  // Configuración inicial al cargar la página
  arScene.style.display = "none";
  controls.style.display = "none";
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "none";

  startButton.addEventListener("click", () => {
    startScreen.style.display = "none";
    arScene.style.display = "block";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    if (arScene.is("paused")) {
      arScene.play();
    }
  });

  arScene.addEventListener("camera-init", () => {
    statusMessage.textContent = "Cámara lista, apunte a un marcador...";
  });

  // Función para manejar la visibilidad y reproducción del video
  function handleMarkerFound(videoEntity) {
    // Pausa y oculta todos los videos
    hideAllVideos();

    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    instructions.style.display = "none";
    controls.style.display = "flex";

    videoEntity.setAttribute("visible", "true");
    videoVisible = videoEntity;

    const videoElement = videoEntity.querySelector("video");
    if (videoElement) {
      videoElement.play();
    }

    updateVideoSize(videoEntity);
    updateVideoPosition(videoEntity);
  }

  // Función para ocultar todos los videos
  function hideAllVideos() {
    videoPizza.setAttribute("visible", "false");
    videoPizza2.setAttribute("visible", "false");

    const videoElement1 = videoPizza.querySelector("video");
    const videoElement2 = videoPizza2.querySelector("video");

    if (videoElement1) videoElement1.pause();
    if (videoElement2) videoElement2.pause();
  }

  // Eventos para el primer marcador
  pizzaMarker.addEventListener("markerFound", () => {
    handleMarkerFound(videoPizza);
  });
  pizzaMarker.addEventListener("markerLost", () => {
    handleMarkerLost();
  });

  // Eventos para el segundo marcador
  pizza2Marker.addEventListener("markerFound", () => {
    handleMarkerFound(videoPizza2);
  });
  pizza2Marker.addEventListener("markerLost", () => {
    handleMarkerLost();
  });

  // Función para manejar la pérdida del marcador
  function handleMarkerLost() {
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    instructions.style.display = "block";
    controls.style.display = "none";

    hideAllVideos();
    videoVisible = null;
  }

  // Eventos de los botones de distancia
  distanceUpButton.addEventListener("click", () => {
    videoDistance += 0.1;
    if (videoVisible) {
      updateVideoPosition(videoVisible);
    }
  });

  distanceDownButton.addEventListener("click", () => {
    videoDistance -= 0.1;
    if (videoVisible) {
      updateVideoPosition(videoVisible);
    }
  });

  function updateVideoSize(videoEntity) {
    const markerWidthInMeters = 1;
    const videoAspectRatio = 16 / 9;
    const scaleFactor = 3;

    const newWidth = markerWidthInMeters * scaleFactor;
    const newHeight = newWidth / videoAspectRatio;

    videoEntity.setAttribute("width", newWidth);
    videoEntity.setAttribute("height", newHeight);
  }

  function updateVideoPosition(videoEntity) {
    const newY = 0.5;
    videoEntity.setAttribute("position", `0 ${newY} ${videoDistance}`);
    distanceValueSpan.textContent = `Distancia: ${videoDistance.toFixed(1)} m`;
  }
});
