const fragmentShader = `
	uniform sampler2D tDefaultPosition;
	uniform sampler2D tPosition;
	uniform sampler2D starImg;
	uniform sampler2D tColour;

	uniform float textColourDivider;

	varying vec2 vUv;

	float setFloatVal(float myFloat) {
		return myFloat + 0.1;
	}

	vec4 setFragVal(vec4 frag) {
		frag.r = setFloatVal(frag.r);
		frag.g = setFloatVal(frag.g);
		frag.b = setFloatVal(frag.b);
		frag.a = setFloatVal(frag.a);

		return frag;
	}

	void main() {
		vec3 defaultPosition = texture2D(tDefaultPosition, vUv).xyz;
		vec3 goal = vec3((vUv - 0.5) * 4.0, 0);
		vec3 position = texture2D(tPosition, vUv).xyz;
		float distanceTravelled = length(position - defaultPosition);
		float distanceToTravel = length(goal - defaultPosition);
		float distanceTravelledRatio = distanceTravelled / distanceToTravel;

		vec4 colour = texture2D(tColour, vUv).rgba;

		gl_FragColor = distanceTravelledRatio <= 0.3 ? (colour / textColourDivider) : setFragVal(colour);
		gl_FragColor = gl_FragColor * texture2D(starImg, gl_PointCoord);
	}
`;

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

		// set size based on red value (to add depth to B&W images)
		float textSizeMultiplierBasedOnColor = texture2D(tText, vUv).r;
		float finalTextSizeMultiplier = textSizeMultiplierBasedOnColor > 0.0 ? textSizeMultiplierBasedOnColor * textSizeMultiplier : textSizeMultiplier;

		// if distanceTravelled > 0.0 then this particle has moved from default position and therefore is a text star
		float size = texture2D(tSize, vUv).a;
		size = distanceTravelled > 0.0 ? mix(size, size * finalTextSizeMultiplier, distanceTravelledRatio > 1.0 ? 1.0 : distanceTravelledRatio) : size;

		// when no img just use this
		// float size = texture2D(tSize, vUv).a;
		// size = distanceTravelled > 0.0 ? mix(size, size * textSizeMultiplier, distanceTravelledRatio > 1.0 ? 1.0 : distanceTravelledRatio) : size;

		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_PointSize = size * (sizeMultiplierForScreen / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

export {
	fragmentShader,
	vertexShader
};
