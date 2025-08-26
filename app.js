document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  const messageBox = document.getElementById("message-box");
  const startButton = document.getElementById("start-ar-button");
  const controls = document.getElementById("controls");
  const distanceUpButton = document.getElementById("distance-up");
  const distanceDownButton = document.getElementById("distance-down");
  const distanceValueSpan = document.getElementById("distance-value");

  // Obtén los videos directamente por su ID para un acceso más fiable
  const videoPizza1 = document.getElementById("pizza-video");
  const videoPizza2 = document.getElementById("pizza2-video");
  const videoPizza3 = document.getElementById("pizza3-video");

  // Obtén las entidades de video
  const videoEntity1 = document.querySelector(
    'a-marker[url="marcador.patt"] a-video'
  );
  const videoEntity2 = document.querySelector(
    'a-marker[url="marcador2.patt"] a-video'
  );
  const videoEntity3 = document.querySelector(
    'a-marker[url="marcador3.patt"] a-video'
  );

  // Variables para controlar la distancia y escala del video
  let currentScale = 1;
  let activeVideoEntity = null;

  // Función para mostrar mensajes en la caja de texto
  const showMessage = (title, message) => {
    messageBox.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
    messageBox.style.display = "block";
  };

  // Al cargar el DOM, oculta la pantalla de carga y muestra el mensaje de inicio
  loadingScreen.style.display = "none";
  showMessage("¡Bienvenido!", 'Pulsa el botón "Iniciar RA" para continuar.');
  startButton.style.display = "block";

  // Evento para el botón de inicio
  startButton.addEventListener("click", () => {
    // Oculta la UI y muestra la escena
    document.getElementById("ui-container").style.display = "none";
    document.querySelector("a-scene").style.display = "block";

    // Desbloquea la reproducción de los videos en navegadores móviles
    [videoPizza1, videoPizza2, videoPizza3].forEach((video) => {
      if (video.paused) {
        video
          .play()
          .catch((e) => console.error("Error al desbloquear el video:", e));
        video.pause(); // Pausa inmediatamente
      }
    });
  });

  // Itera sobre todos los marcadores para agregarles eventos
  document.querySelectorAll("a-marker").forEach((marker) => {
    let videoElement = null;
    let videoEntity = null;

    const markerURL = marker.getAttribute("url");
    if (markerURL.includes("marcador.patt")) {
      videoElement = videoPizza1;
      videoEntity = videoEntity1;
    } else if (markerURL.includes("marcador2.patt")) {
      videoElement = videoPizza2;
      videoEntity = videoEntity2;
    } else if (markerURL.includes("marcador3.patt")) {
      videoElement = videoPizza3;
      videoEntity = videoEntity3;
    }

    // Evento cuando se detecta el marcador
    marker.addEventListener("markerFound", () => {
      console.log("Marcador encontrado:", markerURL);

      // Oculta la caja de mensajes y muestra los controles
      messageBox.style.display = "none";
      controls.style.display = "flex";

      if (videoElement) {
        videoElement.play();
        activeVideoEntity = videoEntity;
        updateVideoScaleAndPosition();
        console.log("Reproduciendo video:", videoElement.id);
      }
    });

    // Evento cuando se pierde el marcador
    marker.addEventListener("markerLost", () => {
      console.log("Marcador perdido:", markerURL);

      // Muestra el mensaje de marcador perdido y oculta los controles
      showMessage(
        "¡Oh no!",
        "Marcador perdido. Por favor, re-escanea para continuar."
      );
      controls.style.display = "none";

      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        activeVideoEntity = null;
        console.log("Video pausado:", videoElement.id);
      }
    });
  });

  // Eventos de los botones de escala
  distanceUpButton.addEventListener("click", () => {
    currentScale += 1;
    updateVideoScaleAndPosition();
  });

  distanceDownButton.addEventListener("click", () => {
    currentScale = Math.max(1, currentScale - 1);
    updateVideoScaleAndPosition();
  });

  function updateVideoScaleAndPosition() {
    if (!activeVideoEntity) return;

    const aspectRatio = 16 / 9;
    const isMobile = window.innerWidth < 768;

    let scaleFactor = currentScale;
    let newPositionZ, newPositionY;

    // Ajuste para dispositivos móviles
    if (isMobile) {
      const mobileScaleFactor = 3;
      scaleFactor = mobileScaleFactor * currentScale;
      newPositionZ = -scaleFactor * 0.5;
      newPositionY = newPositionZ * -1;
    }
    // Ajuste para escritorio o tablet
    else {
      const desktopScaleFactor = 2;
      scaleFactor = desktopScaleFactor * currentScale;
      newPositionZ = -scaleFactor * 0.5;
      newPositionY = newPositionZ * -1;
    }

    const newScaleX = scaleFactor;
    const newScaleY = scaleFactor / aspectRatio;

    activeVideoEntity.setAttribute("scale", `${newScaleX} ${newScaleY} 1`);
    activeVideoEntity.setAttribute(
      "position",
      `0 ${newPositionY} ${newPositionZ}`
    );
    distanceValueSpan.textContent = `Tamaño: ${currentScale.toFixed(0)}`;
  }

  // Inicializa la escala al tamaño de la pantalla cuando se carga la escena
  window.addEventListener("resize", () => {
    if (activeVideoEntity) {
      updateVideoScaleAndPosition();
    }
  });
});
