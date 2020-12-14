import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Datepicker from './Datepicker';
import { VisualisationFilterForm } from './Filter/FilterForm/components';
import { FILTER_TYPES } from '../../../../../../helpers/filtersBuilder.helper';

const FiltersForm = ({ emitFilterChange, dateFilter, visualisationFilter }) => {
  const emitDateFilterChange = emitFilterChange(FILTER_TYPES.DATE);
  const emitVisualisationFilterChange = emitFilterChange(
    FILTER_TYPES.VISUALISATION
  );

  const shouldDisplay = useMemo(
    () => ({
      dateFilter: restrictions.includes(FILTER_TYPES.DATE),
      visualisationFilter: restrictions.includes(FILTER_TYPES.VISUALISATION),
    }),
    [restrictions]
  );

  const dateForm = shouldDisplay?.dateFilter && (
    <Datepicker emitChanges={emitDateFilterChange} values={dateFilter} />
  );

  const visualisationForm = shouldDisplay?.visualisationFilter && (
    <VisualisationFilterForm
      emitChanges={emitVisualisationFilterChange}
      value={visualisationFilter}
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexFlow: 'row wrap',
        width: '100%',
      }}>
      {visualisationForm}
      <span style={{ flexGrow: 1 }} />
      {dateForm}
    </div>
  );
};

FiltersForm.defaultProps = {
  dateFilter: {
    startTime: null,
    endTime: null,
  },
  visualisationFilter: null,
};

FiltersForm.propTypes = {
  visualisationFilter: PropTypes.oneOf(['Line Chart', 'Pie Chart']),
  dateFilter: PropTypes.shape({
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
  emitFilterChange: PropTypes.func.isRequired,
  restrictions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FiltersForm;
