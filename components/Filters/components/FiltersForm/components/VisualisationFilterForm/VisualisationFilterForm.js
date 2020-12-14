import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { ExpandMore } from '@material-ui/icons';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const GenderFilterForm = ({ emitChanges, value }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation('utils');
  const theme = useTheme();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChanges = newValue => {
    emitChanges(newValue);
    handleClose();
  };

  return (
    <div style={{ marginRight: theme.spacing(1) }}>
      <Button
        endIcon={<ExpandMore />}
        aria-controls="gender-filter"
        aria-haspopup="true"
        style={{
          backgroundColor: 'transparent',
          fontWeight: 600,
          textTransform: 'capitalize',
          fontSize: 15,
          fontFamily: 'Nunito',
          color: theme.palette.text.primary,
        }}
        onClick={handleClick}>
        {t('filters.gender')}
      </Button>
      <Menu
        id="gender-filter"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        getContentAnchorEl={null}
        transitionDuration={300}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onClose={handleClose}>
        <MenuItem
          disabled={value === 'linechart'}
          onClick={() => handleChanges('linechart')}>
          {t('common.linechart')}
        </MenuItem>
        <MenuItem
          disabled={value === 'pichart'}
          onClick={() => handleChanges('piechart')}>
          {t('common.piechart')}
        </MenuItem>
      </Menu>
    </div>
  );
};

GenderFilterForm.defaultProps = {
  value: null,
};

GenderFilterForm.propTypes = {
  value: PropTypes.oneOf(['Line Chart', 'Pie Chart']),
  emitChanges: PropTypes.func.isRequired,
};

export default GenderFilterForm;
