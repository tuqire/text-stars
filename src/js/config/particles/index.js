import * as generalConfig from './general';
import * as animationFramesConfig from './animation-frames';
import bp from '../breakpoint';

const configMap = {
  default: {
    ...generalConfig.common,
    ...generalConfig.defaultC,
    animationFrames: animationFramesConfig.defaultC
  },
  xs: {
    ...generalConfig.common,
    ...generalConfig.xs,
    animationFrames: animationFramesConfig.xs
  }
};

configMap.xxs = configMap.xs;
configMap.m = {
  ...configMap.default,
  ...generalConfig.m
}
configMap.l = {
  ...configMap.default,
  ...generalConfig.l
}

const config = configMap[bp] ? configMap[bp] : configMap.default;

export default config;
