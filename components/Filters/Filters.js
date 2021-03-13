import { SelectPicker, DateRangePicker, Icon } from 'rsuite';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { Roles, Visualisations } from '../../lib/constants';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters({ session, ...props }) {
  const [departments, setDepartments] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  /**
   * Render extra filters based on user type:
   * - Health Board users have an extra "Group" filter with a list of departments and
   * hospitals in their health board, grouped by each category respectively
   * - Hospital users have an extra "Group" filter with a list of departments in
   * their hospital
   * - Department managers have an extre "Group" filter which allows them to choose
   * between viewing their own responses or their department's aggregate responses
   *
   * Most of the logic here is to fetch the relevant data asynchronously when the
   * dropdown is selected.
   */
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
    }

    if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
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
    }

    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return (
        <>
          <p>Group</p>
          <SelectPicker
            aria-label="group"
            aria-expanded="false"
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
    }

    return <span />;
  };

  const getMentoringValue = () => {
    if (props.isMentoringSession === true) return 'yes';
    else if (props.isMentoringSession === false) return 'no';
    else return 'any';
  };

  /**
   * The standard filters shown to ALL users are:
   * - Date range: a datepicker
   * - Visualisation: a dropdown menu
   * - Mentoring session: a dropdown menu
   */
  return (
    <div>
      <p>Date Range</p>
      <DateRangePicker
        aria-label="dateRange"
        aria-expanded="false"
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
        aria-label="visualisation"
        aria-expanded="false"
        value={props.visualisationType}
        onChange={value => props.setVisualisationType(value)}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          {
            label: <text id="lineChart">Line Chart</text>,
            value: Visualisations.LINE_CHART,
          },
          {
            label: <text id="enablersWords">Enablers Word Cloud</text>,
            value: Visualisations.WORD_CLOUD_ENABLERS,
          },
          {
            label: <text id="barriersWords">Barriers Word Cloud</text>,
            value: Visualisations.WORD_CLOUD_BARRIERS,
          },
        ]}
      />

      <p>Mentoring?</p>
      <SelectPicker
        aria-label="mentoring"
        aria-expanded="false"
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

Filters.propTypes = {
  /** The user's session object to decide what to display */
  session: PropTypes.object,

  /** Controlled value representing the selected date range, with `start` and `end` properties containing Date instances */
  dateRange: PropTypes.object.isRequired,
  /** Controlled value representing if the user has selected mentoring sessions to be shown */
  isMentoringSession: PropTypes.bool,
  /** Controlled value representing which visualisation type the user has selected */
  visualisationType: PropTypes.oneOf(Object.keys(Visualisations)).isRequired,
  /** Controlled value representing if there is any data entity to override */
  dataToDisplayOverride: PropTypes.object,

  /** Callback function to be called when the mentoring session filter is toggled */
  setIsMentoringSession: PropTypes.func.isRequired,
  /** Callback function to be called when the overriden group filter is toggled */
  setDataToDisplayOverride: PropTypes.func,
  /** Callback function to be called when the date range filter is changed */
  setDateRange: PropTypes.func,
  /** Callback function to be called when the visualisation type filter is toggled */
  setVisualisationType: PropTypes.func,
};

export default Filters;
