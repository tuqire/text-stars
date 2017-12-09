import isWebglEnabled from 'detector-webgl';
import { getParameterByName, getZRatio } from './utils';
import Camera from './io/camera';
import Renderer from './io/renderer';
import Scene from './objects/scene';
import Particles from './objects/particles';

document.addEventListener('DOMContentLoaded', () => {
	if (isWebglEnabled) {
		const container = document.getElementById('stars-simulation-container');
		const renderer = new Renderer({ container });
		const scene = new Scene();
		const particles = new Particles({
			renderer,
			skew: 													15,
		  hoverDist: 											0.04,
		  hoverSizeInc: 									0.01,
		  hoverMaxSizeMultiplier: 				3,
		  textSizeMultiplier: 						7.5,
		  textPositionMultiplier:					6,
		  minSize:												0.02,
		  maxSize: 												0.05,
		  sizeDif:												2,
		  incSize: 												0.0001,
			numParticles: 									150000,
		  radius: 												4,
		  topSpeed:												1,
		  acceleration:										0.0001
		});
		const camera = new Camera({
			particles,
			position: {
		    x: 														0,
		    y: 														-0.001,
		    z: 														4.5
		  }
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
