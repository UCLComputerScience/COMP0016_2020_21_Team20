import React from 'react';
import PropTypes from 'prop-types';

import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core';
import {
  CountryFilter,
  GenderFilter,
  QualityFilter,
  RetentionFilter,
  SubscribersFilter,
  VerificationFilter,
} from './components';
import { FILTER_TYPES } from '../../../../../../helpers/filtersBuilder.helper';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    flexFlow: 'row wrap',
    fontSize: 14,
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

const ActiveFilters = ({
  subscribersFilters,
  verificationFilter,
  retentionFilters,
  emitFilterChange,
  countryFilters,
  qualityFilter,
  genderFilter,
}) => {
  const classes = useStyles();
  const emitGenderFilterChange = emitFilterChange(FILTER_TYPES.GENDER);
  const emitCountryFilterChange = emitFilterChange(FILTER_TYPES.COUNTRY);
  const emitQualityFilterChange = emitFilterChange(FILTER_TYPES.QUALITY);
  const emitRetentionFilterChange = emitFilterChange(FILTER_TYPES.RETENTION);
  const emitSubscribersFilterChange = emitFilterChange(
    FILTER_TYPES.SUBSCRIBERS
  );
  const emitVerificationFilterChange = emitFilterChange(
    FILTER_TYPES.VERIFICATION
  );

  const countryFilterValues = countryFilters.map(countryCode => {
    return (
      <Fade key={countryCode} in timeout={250}>
        <CountryFilter
          countryCode={countryCode}
          onDelete={() => {
            emitCountryFilterChange(
              countryFilters.filter(country => country !== countryCode)
            );
          }}
        />
      </Fade>
    );
  });

  const canSubscribersFilterBeRendered =
    subscribersFilters?.from || subscribersFilters?.to;
  const canRetentionFilterBeRendered =
    retentionFilters?.from || retentionFilters?.to;

  return (
    <div className={classes.container}>
      {countryFilterValues}
      {qualityFilter && (
        <Fade in timeout={300}>
          <QualityFilter onDelete={() => emitQualityFilterChange(null)} />
        </Fade>
      )}
      {genderFilter && (
        <Fade in timeout={300}>
          <GenderFilter
            value={genderFilter}
            onDelete={() => emitGenderFilterChange(null)}
          />
        </Fade>
      )}
      {verificationFilter && (
        <Fade in timeout={300}>
          <VerificationFilter
            value={verificationFilter}
            onDelete={() => emitVerificationFilterChange(null)}
          />
        </Fade>
      )}
      {canSubscribersFilterBeRendered && (
        <Fade in timeout={300}>
          <SubscribersFilter
            value={subscribersFilters}
            onDelete={() => emitSubscribersFilterChange({ from: '', to: '' })}
          />
        </Fade>
      )}
      {canRetentionFilterBeRendered && (
        <Fade in timeout={300}>
          <RetentionFilter
            value={retentionFilters}
            onDelete={() =>
              emitRetentionFilterChange({ from: undefined, to: undefined })
            }
          />
        </Fade>
      )}
    </div>
  );
};

ActiveFilters.defaultProps = {
  countryFilters: [],
  qualityFilter: null,
  genderFilter: null,
  verificationFilter: null,
  subscribersFilters: {
    from: null,
    to: null,
  },
  retentionFilters: {
    from: null,
    to: null,
  },
};

ActiveFilters.propTypes = {
  countryFilters: PropTypes.arrayOf(PropTypes.string),
  qualityFilter: PropTypes.bool,
  genderFilter: PropTypes.oneOf(['male', 'female']),
  verificationFilter: PropTypes.oneOf(['verified', 'unverified']),
  subscribersFilters: PropTypes.shape({
    from: PropTypes.number,
    to: PropTypes.number,
  }),
  retentionFilters: PropTypes.shape({
    from: PropTypes.number,
    to: PropTypes.number,
  }),
  emitFilterChange: PropTypes.func.isRequired,
};

export default ActiveFilters;
