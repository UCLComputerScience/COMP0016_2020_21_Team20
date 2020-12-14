import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Popover, useTheme } from '@material-ui/core';
import { DateRangePicker } from 'react-date-range';
import DateRangeIcon from '@material-ui/icons/DateRange';

import 'react-date-range/dist/styles.css';
import './overrides.css';

const Datepicker = ({ emitChanges, values }) => {
  const [anchorElement, setAnchorElement] = useState(false);
  const theme = useTheme();

  const handleSelect = ranges => {
    emitChanges({
      ...values,
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const openPopup = event => {
    setAnchorElement(event.currentTarget);
  };

  const closePopup = () => {
    setAnchorElement(null);
  };

  const label = `${moment(values?.startDate).format('MMMM Do')} - ${moment(
    values?.endDate
  ).format('MMMM Do')}`;

  return (
    <>
      <Button
        onClick={openPopup}
        style={{
          background: 'transparent',
          color: theme.palette.text.primary,
          fontFamily: 'Nunito',
          textTransform: 'capitalize',
        }}>
        {label}
        <DateRangeIcon style={{ marginLeft: theme.spacing(1) }} />
      </Button>
      <Popover
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        onClose={closePopup}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <DateRangePicker
          ranges={[values]}
          onChange={handleSelect}
          color={theme.palette.text.activeNavLink}
          showDateDisplay={false}
        />
      </Popover>
    </>
  );
};

Datepicker.prototype = {
  emit: PropTypes.func.isRequired,
  values: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
  }).isRequired,
};

export default Datepicker;
