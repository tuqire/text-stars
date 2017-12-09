export const defaultAnimationDelayLength = 1000;

const animationFrames = [{
  animationDelay: defaultAnimationDelayLength,
  canvasDepth: 1,
  text: [
    {
      text: 'You are not a spec in the universe',
      fontSize: 28,
      position: { y: -10 }
    },
    {
      text: 'You are the entire universe in a spec',
      fontSize: 27,
      position: { y: 17 }
    }
  ]
}, {
  animationDelay: defaultAnimationDelayLength + 17000,
  canvasDepth: 1,
  text: [
    {
    	text: 'Welcome To',
    	fontSize: 25,
    	position: { y: -50 }
    },
    {
      text: 'Tuqire.com',
      fontSize: 83,
      position: { y: 22 }
    }
  ],
  // images: [
  //   {
  //     src: 'http://localhost:8084/assets/images/tuqire-vector-bw.png',
  //     position: { x: 300, y: 225 },
  //     width: 200
  //   }
  // ]
}];

export default animationFrames;
