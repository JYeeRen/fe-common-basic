import logger from 'debug';

localStorage.debug = 'R&T:*'

const basic = logger('R&T');

export const debug = {
  common: basic.extend('common'),
  infra: basic.extend('infra'),
  features: basic.extend('features'),
  svc: basic.extend('svc'),
  auth: basic.extend('auth'),
};
