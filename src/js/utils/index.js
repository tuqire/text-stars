export function getParameterByName(name, url) {
	if (!url) {
		url = window.location.href;
	}

	name = name.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
	const results = regex.exec(url);

	if (!results) return null;
	if (!results[2]) return '';

	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getZRatio() {
  if (window.innerWidth > 1100) {
    return 170;
  } else if (window.innerWidth > 700) {
    return 100;
  } else if (window.innerWidth > 500) {
    return 85;
  } else {
    return 50;
  }
}

export function createDataTexture({
	data,
	tWidth,
	tHeight,
	format,
	filterType
}) {
	const dataTexture = new THREE.DataTexture(
		data,
		tWidth,
		tHeight,
		format,
		THREE.FloatType
	);

	dataTexture.minFilter = dataTexture.magFilter = filterType;
	dataTexture.needsUpdate = true;
	dataTexture.flipY = false;

	return dataTexture;
}
