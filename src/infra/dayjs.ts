import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { debug } from './debug';
import { find } from 'lodash';
import optionsService from '@services/options.service';

dayjs.extend(utc);
dayjs.extend(timezone);

export default dayjs;


export const convertDate = (date: Dayjs, timeZone: string) => {
  const tzItem = find(optionsService.timeZones, { value: timeZone });
  const selectedDate = date;
  debug.features('选择的日期', selectedDate.format('YYYY-MM-DDTHH:mm:ssZ'))

  const targetZoneDate = dayjs()
    .utcOffset((tzItem?.offset ?? 0) / 60)
    .year(selectedDate.year())
    .month(selectedDate.month())
    .date(selectedDate.date())
    .hour(selectedDate.hour())
    .minute(selectedDate.minute())
    .second(selectedDate.second());

  debug.features('增加时区信息后的时间', targetZoneDate.format('YYYY-MM-DDTHH:mm:ssZ'))
  debug.features('对应的东八区时间', targetZoneDate.utcOffset(480).format('YYYY-MM-DDTHH:mm:ssZ'));
  return targetZoneDate;
}