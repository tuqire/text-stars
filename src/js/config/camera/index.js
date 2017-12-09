import defaultC from './default';
import xs from './xs';
import m from './m';
import bp from '../breakpoint';

const configMap = {
  default: defaultC,
  xs,
  m
};

configMap.xxs = configMap.xs;
configMap.l = configMap.m;

const config = configMap[bp] ? configMap[bp] : configMap.default;

export default config;
