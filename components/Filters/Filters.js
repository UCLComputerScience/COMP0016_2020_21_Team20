import { SelectPicker, DateRangePicker } from 'rsuite';
import { useSession } from 'next-auth/client';

import { Visualisations, UserGroups } from '../../lib/constants';
import roles from '../../lib/roles';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters(props) {
  const [session] = useSession();

  const getMentoringValue = () => {
    if (props.isMentoringSession === true) return 'yes';
    else if (props.isMentoringSession === false) return 'no';
    else return 'any';
  };

  const renderExtraFilters = () => {
    if (session.roles.includes(roles.USER_TYPE_HEALTH_BOARD)) {
    } else if (session.roles.includes(roles.USER_TYPE_HOSPITAL)) {
    } else if (session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={props.userGroup}
            onChange={value => props.setUserGroup(value)}
            searchable={false}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              { label: 'Myself', value: UserGroups.MYSELF },
              { label: 'My Department', value: UserGroups.DEPARTMENT },
            ]}
          />
        </>
      );
    } else {
      return <span />;
    }
  };

  return (
    <div>
      <p>Date Range</p>
      <DateRangePicker
        showOneCalendar
        onChange={([start, end]) => props.setDateRange({ start, end })}
        value={[props.dateRange.start, props.dateRange.end]}
        isoWeek={true}
        cleanable={false}
        block={true}
        disabledDate={DateRangePicker.afterToday()}
        ranges={[
          { label: 'Last 7 days', value: [subtractDays(7), new Date()] },
          { label: 'Last 30 days', value: [subtractDays(30), new Date()] },
          { label: 'Last year', value: [subtractDays(365), new Date()] },
        ]}
      />

      <p>Visualisation</p>
      <SelectPicker
        value={props.visualisationType}
        onChange={value => props.setVisualisationType(value)}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          { label: 'Line Chart', value: Visualisations.LINE_CHART },
          { label: 'Word Cloud', value: Visualisations.WORD_CLOUD },
        ]}
      />

      <p>Mentoring?</p>
      <SelectPicker
        value={getMentoringValue()}
        onChange={value => {
          if (value === 'yes') props.setIsMentoringSession(true);
          else if (value === 'no') props.setIsMentoringSession(false);
          else props.setIsMentoringSession(null);
        }}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          { label: 'Any', value: 'any' },
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
      />

      {renderExtraFilters()}
    </div>
  );
}

export default Filters;
