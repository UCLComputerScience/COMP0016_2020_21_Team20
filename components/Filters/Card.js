import React from 'react';
import { Paper } from '@material-ui/core';

const Card = ({ children, className, elevation = 3 }) => {
  return (
    <Paper elevation={elevation} className={className}>
      {children}
    </Paper>
  );
};

export default Card;
