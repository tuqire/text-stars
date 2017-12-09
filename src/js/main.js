import isWebglEnabled from 'detector-webgl';
import { getParameterByName, getZRatio } from './utils';
import Camera from './io/camera';
import Renderer from './io/renderer';
import Scene from './objects/scene';
import Particles from './objects/particles';
import particlesConfig from './config/particles';
import cameraConfig from './config/camera';
import './io/mouse';

document.addEventListener('DOMContentLoaded', () => {
	if (isWebglEnabled) {
		const container = document.getElementById('stars-simulation-container');
		const renderer = new Renderer({ container });
		const scene = new Scene();
		const particles = new Particles({
			renderer,
			...particlesConfig
		});
		const camera = new Camera({
			particles,
			...cameraConfig
		});

		const init = () => {
			scene.add(particles.get());
		};

		const animate = () => {
			requestAnimationFrame(animate);
			render();
		};

		const render = () => {
			particles.update();

			renderer.render({
				scene: scene.get(),
				camera: camera.get()
			});
		};

		init();
		animate();
	} else {
		const info = document.getElementById('info');
		info.innerHTML = 'Your browser is not supported. Please use the latest version of Firefox or Chrome.';
	}
});
