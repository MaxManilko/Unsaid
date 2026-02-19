// Load YouTube IFrame API
(function loadYouTubeAPI(){
	const tag = document.createElement('script');
	tag.src = 'https://www.youtube.com/iframe_api';
	document.head.appendChild(tag);
})();

let player;

function onYouTubeIframeAPIReady() {
	player = new YT.Player('youtubePlayer', {
		height: '492',
		width: '859',
		videoId: '1iT1z2Cosa4',
		playerVars: { rel: 0 },
		events: {
			onReady: onPlayerReady,
			onError: onPlayerError
		}
	});
}

function onPlayerReady(event) {
	console.log('YouTube player ready');
}

function onPlayerError(event) {
	const code = event && event.data;
	const errEl = document.getElementById('playerError');
	const openLink = document.getElementById('openOnYouTube');
	console.error('YouTube Player Error code:', code);
	let msg = 'Помилка програвача: код ' + code;
	if (code === 101 || code === 150 || code === 153) {
		msg = 'Помилка конфігурації відеопрогравача: вбудовування заборонено власником відео.';
	} else if (code === 100) {
		msg = 'Відео не знайдено або видалено.';
	} else if (code === 2) {
		msg = 'Некоректні параметри відтворення.';
	} else if (code === 5) {
		msg = 'HTML5-плеєр не підтримується на цьому пристрої.';
	}
	if (errEl) errEl.textContent = msg;
	if (openLink) openLink.style.display = 'inline';
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

