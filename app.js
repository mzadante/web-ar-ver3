document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-ar-button');
    const startScreen = document.getElementById('start-screen');
    const arScene = document.getElementById('ar-scene');
    const overlay = document.getElementById('ui-overlay');
    const instructions = document.getElementById('instructions');
    const statusMessage = document.getElementById('status-message');
    const videoMarker = document.getElementById('video-marker');
    const videoEntity = document.getElementById('video-entidad');
    const distanceUpButton = document.getElementById('distance-up');
    const distanceDownButton = document.getElementById('distance-down');
    const distanceValueSpan = document.getElementById('distance-value');

    let videoVisible = false;
    let videoDistance = 0;

    // Oculta la escena AR y los controles al inicio
    arScene.style.display = 'none';
    const controls = document.getElementById('controls');
    controls.style.display = 'none';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        arScene.style.display = 'block';
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        if (arScene.is('paused')) {
            arScene.play();
        }
    });

    arScene.addEventListener('camera-init', () => {
        statusMessage.textContent = 'Cámara lista, apunte al marcador...';
    });

    videoMarker.addEventListener('markerFound', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        instructions.style.display = 'none';
        controls.style.display = 'flex';
        videoEntity.setAttribute('visible', 'true');
        videoVisible = true;
        const video = document.querySelector('#video-arte');
        video.play();
        
        // Ajusta dinámicamente el tamaño y la posición del video
        updateVideoSize();
        updateVideoPosition();
    });

    videoMarker.addEventListener('markerLost', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        instructions.style.display = 'block';
        controls.style.display = 'none';
        videoEntity.setAttribute('visible', 'false');
        videoVisible = false;
        const video = document.querySelector('#video-arte');
        video.pause();
    });

    distanceUpButton.addEventListener('click', () => {
        videoDistance += 0.1;
        updateVideoPosition();
    });

    distanceDownButton.addEventListener('click', () => {
        videoDistance -= 0.1;
        updateVideoPosition();
    });

    function updateVideoSize() {
        const markerWidthInMeters = 1;
        const videoAspectRatio = 16 / 9;
        
        // Factor de escala para hacerlo más grande en la vista del usuario. 
        // Puedes ajustar este valor si el video se ve muy grande o pequeño.
        const scaleFactor = 3; 
        
        const newWidth = markerWidthInMeters * scaleFactor;
        const newHeight = newWidth / videoAspectRatio;
        
        videoEntity.setAttribute('width', newWidth);
        videoEntity.setAttribute('height', newHeight);
    }
    
    function updateVideoPosition() {
        if (videoVisible) {
            // Desplaza el video ligeramente hacia arriba del marcador en el eje Y 
            // y aplica el ajuste de distancia en el eje Z.
            const newY = 0.5; // Un valor fijo para levantar el video sobre el marcador.
            videoEntity.setAttribute('position', `0 ${newY} ${videoDistance}`);
            distanceValueSpan.textContent = `Distancia: ${videoDistance.toFixed(1)} m`;
        }
    }
});