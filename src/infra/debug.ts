import logger from 'debug';

const basic = logger('');

export const debug = {
  infra: basic.extend('infra'),
  features: basic.extend('features'),
  svc: basic.extend('svc'),
};
