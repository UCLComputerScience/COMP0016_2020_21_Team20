import { SelectPicker, DateRangePicker, Icon } from 'rsuite';
import { useState } from 'react';

import { Roles, Visualisations } from '../../lib/constants';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters({ session, ...props }) {
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const getMentoringValue = () => {
    if (props.isMentoringSession === true) return 'yes';
    else if (props.isMentoringSession === false) return 'no';
    else return 'any';
  };

  const renderExtraFilters = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={
              props.dataToDisplayOverride === null
                ? 'health_board'
                : `${props.dataToDisplayOverride.key}-${props.dataToDisplayOverride.value}`
            }
            onOpen={() => {
              fetch('/api/departments')
                .then(res => res.json())
                .then(res => setDepartments(res));

              fetch('/api/hospitals')
                .then(res => res.json())
                .then(res => setHospitals(res));
            }}
            onChange={value => {
              if (value === 'health_board') {
                props.setDataToDisplayOverride(null);
              } else {
                const split = value.split('-');
                props.setDataToDisplayOverride({
                  key: split[0],
                  value: split[1],
                });
              }
            }}
            searchable={true}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              {
                label: 'My Health Board',
                value: 'health_board',
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
            groupBy="type"
            renderMenu={menu =>
              hospitals.length || departments.length ? (
                menu
              ) : (
                <Icon icon="spinner" spin />
              )
            }
          />
        </>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={
              props.dataToDisplayOverride === null
                ? 'hospital'
                : `${props.dataToDisplayOverride.key}-${props.dataToDisplayOverride.value}`
            }
            onOpen={() =>
              fetch('/api/departments')
                .then(res => res.json())
                .then(res => setDepartments(res))
            }
            onChange={value => {
              if (value === 'hospital') {
                props.setDataToDisplayOverride(null);
              } else {
                const split = value.split('-');
                props.setDataToDisplayOverride({
                  key: split[0],
                  value: split[1],
                });
              }
            }}
            searchable={true}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              {
                label: 'My Hospital',
                value: 'hospital',
                type: 'Hospital',
              },
              ...departments.map(d => ({
                label: d.name,
                value: `department_id-${d.id}`,
                type: 'Department',
              })),
            ]}
            groupBy="type"
            renderMenu={menu =>
              departments.length ? menu : <Icon icon="spinner" spin />
            }
          />
        </>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            value={props.dataToDisplayOverride ? 'myself' : 'department'}
            onChange={value =>
              props.setDataToDisplayOverride(
                value === 'myself'
                  ? { key: 'user_id', value: session.user.userId }
                  : null
              )
            }
            searchable={false}
            placeholder="Select"
            cleanable={false}
            block={true}
            data={[
              { label: 'Myself', value: 'myself' },
              { label: 'My Department', value: 'department' },
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
          { label: 'Enablers Word Cloud', value: Visualisations.WORD_CLOUD },
          {
            label: 'Barriers Word Cloud',
            value: Visualisations.WORD_CLOUD_BARRIERS,
          },
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
      {props.isMentoringSession === true ||
        (props.isMentoringSession === null && (
          <i>Triangles represent a mentoring session point</i>
        ))}
      {renderExtraFilters()}
    </div>
  );
}

export default Filters;
