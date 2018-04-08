/* eslint-disable */

const fragmentShader = `
	uniform sampler2D tPosition;
	uniform sampler2D starImg;
	uniform sampler2D tColour;

	varying vec2 vUv;

	void main() {
		vec3 goal = vec3((vUv - 0.5) * 4.0, 0);
		vec3 position = texture2D(tPosition, vUv).xyz;
		vec4 colour = texture2D(tColour, vUv).rgba;
		float isTextColor = texture2D(tPosition, vUv).a;

		gl_FragColor = colour;
		gl_FragColor = gl_FragColor * texture2D(starImg, gl_PointCoord);
	}
`

const vertexShader = `
	uniform sampler2D tDefaultPosition;
	uniform sampler2D tPosition;
	uniform sampler2D tSize;
	uniform sampler2D tText;

	uniform float sizeMultiplierForScreen;
	uniform float textSizeMultiplier;

	varying vec2 vUv;

	void main() {
		vUv = position.xy;
		vec3 goal = vec3((vUv - 0.5) * 4.0, 0);

		// position saved as rgba / xyzw value in a texture object in memory
		vec3 defaultPosition = texture2D(tDefaultPosition, vUv).xyz;
		vec3 position = texture2D(tPosition, vUv).xyz;
		float distanceToTravel = length(goal - defaultPosition);
		float distanceTravelled = length(position - defaultPosition);
		float distanceTravelledRatio = distanceTravelled / distanceToTravel;

		// if distanceTravelled > 0.0 then this particle has moved from default position and therefore is a text star
		float size = texture2D(tSize, vUv).a;
		float textSize = size * size * textSizeMultiplier; // multiply star size against itself to create size skew
		size = distanceTravelled > 0.0 ? mix(size, textSize, distanceTravelledRatio > 1.0 ? 1.0 : distanceTravelledRatio) : size;

		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = size * (sizeMultiplierForScreen / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`

export {
  fragmentShader,
  vertexShader
}
