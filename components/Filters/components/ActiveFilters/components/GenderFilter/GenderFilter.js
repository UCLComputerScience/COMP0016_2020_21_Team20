import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IconButton, makeStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
    backgroundColor: theme.palette.background.filter,
    color: theme.palette.text.filter,
    fontSize: 14,
    padding: theme.spacing(1, 0, 1, 2),
    margin: theme.spacing(1),
  },
  text: {
    fontWeight: '700',
    color: 'inherit',
    fontSize: 'inherit',
    marginRight: theme.spacing(1),
  },
  removeIcon: {
    width: 10,
    height: 'auto',
    color: 'inherit',
    fontSize: 'inherit',
    // color: theme.palette.text.filter,
  },
}));

const GenderFilter = ({ onDelete, value }) => {
  const { t } = useTranslation('utils');
  const classes = useStyles();

  const label = useMemo(() => {
    if (value === 'male') {
      return t('common.male');
    }

    if (value === 'female') {
      return t('common.female');
    }

    return null;
  }, [value]);

  return (
    <div className={classes.container}>
      <span>{label}</span>
      <IconButton onClick={() => onDelete()}>
        <Clear className={classes.removeIcon} />
      </IconButton>
    </div>
  );
};

GenderFilter.defaultProps = {
  value: null,
};

GenderFilter.propTypes = {
  value: PropTypes.oneOf(['male', 'female']),
  onDelete: PropTypes.func.isRequired,
};

export default GenderFilter;
