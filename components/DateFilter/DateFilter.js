import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css fil
import { DateRange } from 'react-date-range';
import { useState } from 'react';

export function DateFilter(props) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  return (
    <>
      <DateRange
        editableDateInputs={true}
        onChange={item => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
      />
    </>
  );
}
export default DateFilter;
