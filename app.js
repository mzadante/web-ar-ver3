// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const messageBox = document.getElementById('message-box');
    const markers = document.querySelectorAll('a-marker');

    // Función para mostrar mensajes en la caja de texto
    const showMessage = (title, message) => {
        messageBox.innerHTML = `<h2>${title}</h2><p>${message}</p>`;
        messageBox.style.display = 'block';
    };

    // Ocultar la pantalla de carga una vez que A-Frame está listo
    window.addEventListener('load', () => {
        loadingScreen.style.display = 'none';
        showMessage('¡Bienvenido!', 'Por favor, escanea uno de los códigos QR de pizza para comenzar.');
    });

    // Itera sobre todos los marcadores para agregarles eventos
    markers.forEach(marker => {
        // Evento cuando se detecta el marcador
        marker.addEventListener('markerFound', (e) => {
            console.log('Marcador encontrado:', e.target.getAttribute('url'));
            showMessage('¡Éxito!', '¡Marcador detectado! Disfruta tu video de pizza.');
            
            const video = marker.querySelector('a-video').components.material.texture.image;
            if (video) {
                video.play();
            }
        });

        // Evento cuando se pierde el marcador
        marker.addEventListener('markerLost', (e) => {
            console.log('Marcador perdido:', e.target.getAttribute('url'));
            showMessage('¡Oh no!', 'Marcador perdido. Por favor, re-escanea para continuar.');
            
            const video = marker.querySelector('a-video').components.material.texture.image;
            if (video) {
                video.pause();
                video.currentTime = 0; // Reinicia el video para la próxima vez
            }
        });
    });

    // Manejo de eventos de clic en el documento para reanudar el video en iOS/safari
    document.body.addEventListener('click', () => {
        markers.forEach(marker => {
            const video = marker.querySelector('a-video').components.material.texture.image;
            if (video && video.paused) {
                video.play().catch(e => console.error("Error al intentar reproducir el video:", e));
            }
        });
    });
});
