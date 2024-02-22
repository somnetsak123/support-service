import 'moment/dist/locale/th';
import moment from 'moment';

export function thaiDate(
  date?: string | Date | null,
  fullmonth = false,
  time = false,
) {
  moment.locale('th');
  const m = moment(date);

  if (!m.isValid()) return null;

  const year = m.year() + 543;
  const month = m.format(fullmonth ? 'MMMM' : 'MMM');

  return m.format(`DD ${month} ${year} ${time ? 'hh:mm น.' : ''}`);
}
