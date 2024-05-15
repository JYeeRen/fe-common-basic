import { t } from '@locale';
import type { FormRule } from 'antd';
// import { compact } from 'lodash';

export const textareaMaxLengthRule = (): FormRule => ({
  // transform: (value: string) => compact(value.split(/,|\n+|\r+|\s+/)),
  type: 'array',
  max: 50,
  message: t('最多可查询50条')
});
