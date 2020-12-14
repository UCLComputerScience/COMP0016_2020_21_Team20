import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import * as R from 'ramda';

import Card from './Card';
import { SearchBar, ActiveFilters, FiltersForm } from './components';
import { FILTER_TYPES } from './FiltersBuilder.helper.js';
import isNilOrEmptyString from './isNilOrEmptyString.helper.js';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(2, 3),
  },
  marginBottom: {
    marginBottom: theme.spacing(2),
  },
}));

const Filters = ({ config, emitValues }) => {
  const [dateFilter, setDateFilter] = useState({
    startDate: moment().subtract(7, 'days').toDate(),
    endDate: new Date(),
    key: 'selection',
  });

  const [searchFilter, setSearchFilter] = useState(undefined);
  const [visualisationFilter, setVisualisationFilter] = useState(null);

  const filtersRestrictions = config.map(filter => filter.type);
  const classes = useStyles();

  // eslint-disable-next-line consistent-return
  const handleFilterChange = filterType => values => {
    if (filterType === FILTER_TYPES.DATE) {
      return setDateFilter(values);
    }

    if (filterType === FILTER_TYPES.SEARCH) {
      return setSearchFilter(values);
    }

    if (filterType === FILTER_TYPES.GENDER) {
      return setVisualisationFilter(values);
    }

    console.warn(`Unhandled changes of unknown filter type - ${filterType}`);
  };

  useEffect(() => {
    const filterValues = R.reject(isNilOrEmptyString, {
      startDate: dateFilter?.startDate,
      endDate: dateFilter?.endDate,
      visualisationFilter,
      searchFilter,
    });

    emitValues(filterValues);
    console.log(filterValues);
  }, [dateFilter, searchFilter, visualisationFilter]);

  return (
    <Card className={classes.container}>
      {filtersRestrictions.includes(FILTER_TYPES.SEARCH) && (
        <SearchBar value={searchFilter} emitChanges={handleFilterChange} />
      )}
      <ActiveFilters
        visualisationFilter={visualisationFilter}
        emitFilterChange={handleFilterChange}
      />
      <FiltersForm
        dateFilter={dateFilter}
        visualisationFilter={visualisationFilter}
        emitFilterChange={handleFilterChange}
      />
    </Card>
  );
};

Filters.defaultProps = {
  config: [],
};

Filters.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(Object.values(FILTER_TYPES)).isRequired,
      values: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.any),
        PropTypes.any,
      ]),
    }).isRequired
  ),
  emitValues: PropTypes.func.isRequired,
};

export default Filters;
