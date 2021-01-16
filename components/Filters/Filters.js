import { SelectPicker, DateRangePicker, Icon } from 'rsuite';
import { useSession } from 'next-auth/client';
import { useState } from 'react';

import { Visualisations } from '../../lib/constants';
import roles from '../../lib/roles';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters(props) {
  const [session] = useSession();
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const getMentoringValue = () => {
    if (props.isMentoringSession === true) return 'yes';
    else if (props.isMentoringSession === false) return 'no';
    else return 'any';
  };

  const SelectPickerGroups = ({ isLoading, fetches, ...componentProps }) => {
    return (
      <SelectPicker
        {...componentProps}
        value={
          props.dataToDisplayOverride === null
            ? 'default'
            : `${props.dataToDisplayOverride.key}-${props.dataToDisplayOverride.value}`
        }
        onOpen={() => {
          if (!departments.length && fetches.includes('departments')) {
            fetch('/api/departments')
              .then(res => res.json())
              .then(res => setDepartments(res));
          }

          if (!hospitals.length && fetches.includes('hospitals')) {
            fetch('/api/hospitals')
              .then(res => res.json())
              .then(res => setHospitals(res));
          }
        }}
        onChange={value => {
          if (value === 'default') {
            props.setDataToDisplayOverride(null);
          } else {
            const split = value.split('-');
            props.setDataToDisplayOverride({
              key: split[0],
              value: split[1],
            });
          }
        }}
        renderMenu={menu =>
          !departments.length ? <Icon icon="spinner" spin /> : menu
        }
        groupBy="type"
        searchable={true}
        placeholder="Select"
        cleanable={false}
        block={true}
      />
    );
  };

  const renderExtraFilters = () => {
    if (session.roles.includes(roles.USER_TYPE_HEALTH_BOARD)) {
      return (
        <>
          <p>Group</p>
          <SelectPickerGroups
            fetches={['departments', 'hospitals']}
            data={[
              {
                label: 'My Health Board',
                value: 'default',
                type: 'Health Board',
              },
              ...departments.map(d => ({
                label: d.name,
                value: `department_id-${d.id}`,
                type: 'Department',
              })),
              ...hospitals.map(h => ({
                label: h.name,
                value: `hospital_id-${h.id}`,
                type: 'Hospital',
              })),
            ]}
            isLoading={!hospitals.length && !departments.length}
          />
        </>
      );
    } else if (session.roles.includes(roles.USER_TYPE_HOSPITAL)) {
      return (
        <>
          <p>Group</p>
          <SelectPickerGroups
            fetches={['departments']}
            data={[
              {
                label: 'My Hospital',
                value: 'default',
                type: 'Hospital',
              },
              ...departments.map(d => ({
                label: d.name,
                value: `department_id-${d.id}`,
                type: 'Department',
              })),
            ]}
            isLoading={!departments.length}
          />
        </>
      );
    } else if (session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
      return (
        <>
          <p>Group</p>
          <SelectPickerGroups
            data={[
              { label: 'My Department', value: 'default' },
              { label: 'Myself', value: `user_id-${session.user.id}` },
            ]}
            isLoading={false}
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
