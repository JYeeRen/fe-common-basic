import { t } from '@locale';
import type { FormRule } from 'antd';
// import { compact } from 'lodash';

export const textareaMaxLengthRule = (max = 50): FormRule => ({
  // transform: (value: string) => compact(value.split(/,|\n+|\r+|\s+/)),
  type: 'array',
  max,
  message: t('最多可查询50条')
});
