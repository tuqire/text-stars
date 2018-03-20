/* eslint-disable */

const positionSimulationFragmentShader = `
	/** generates a random number between 0 and 1 **/
	highp float rand(vec2 co) {
		highp float a = 12.9898;
		highp float b = 78.233;
		highp float c = 43758.5453;
		highp float dt= dot(co.xy ,vec2(a,b));
		highp float sn= mod(dt,3.14);
		return fract(sin(sn) * c);
	}

	// this is the texture position the data for this particle is stored in
	varying vec2 vUv;

	uniform sampler2D tPrev;
	uniform sampler2D tCurr;

	uniform sampler2D tDefaultPosition;
	uniform sampler2D tText;

	uniform float topSpeed;
	uniform float acceleration;
	uniform float textPositionMultiplier;

	vec3 setTopSpeed(vec3 speed, float topSpeed) {
		return vec3(
			speed.x > topSpeed ? topSpeed : speed.x < -topSpeed ? -topSpeed : speed.x,
			speed.y > topSpeed ? topSpeed : speed.y < -topSpeed ? -topSpeed : speed.y,
			speed.z > topSpeed ? topSpeed : speed.z < -topSpeed ? -topSpeed : speed.z
		);
	}

	vec3 moveParticleToGoal(vec3 currPos, vec3 prevPos, vec3 goal) {
		vec3 distanceToGoal = goal - currPos;
		vec3 currVelocity = currPos - prevPos;

		vec3 calculatedAcceleration = normalize(distanceToGoal) * acceleration;
		float currVelocityL = length(currVelocity);
		float distanceToGoalL = length(distanceToGoal);

		if (distanceToGoalL > currVelocityL) {
			vec3 velocity = currVelocity + calculatedAcceleration;

			velocity = setTopSpeed(velocity, topSpeed);

			return currPos + velocity;
		} else {
			return goal;
		}
	}

	void main() {
		vec3 defaultPos = texture2D(tDefaultPosition, vUv).xyz;
		vec3 prevPos = texture2D(tPrev, vUv).xyz;
		vec3 position = texture2D(tCurr, vUv).xyz;
		float textOpacity = texture2D(tText, vUv).r;
		float isTextParticle = 0.0;

		if (prevPos == vec3(0.0, 0.0, 0.0)) {
			position = defaultPos;
		}

		if (textOpacity > 0.0) {
			position = moveParticleToGoal(position, prevPos, vec3((vUv - 0.5) * textPositionMultiplier, 0.0));

			isTextParticle = 1.0;
		} else {
			position = moveParticleToGoal(position, prevPos, defaultPos);
		}

		// write new positions out
		gl_FragColor = vec4(position, isTextParticle);
	}
`

const positionSimulationVertexShader = `
	// this value stores the texture coordinates the data for this vertex is stored in
	varying vec2 vUv;

	void main() {
	  vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`

export {
  positionSimulationFragmentShader,
  positionSimulationVertexShader
}
