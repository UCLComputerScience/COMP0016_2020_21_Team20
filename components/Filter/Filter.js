import { DateFilter, VisualisationFilter } from '..';
import React from 'react';

export function Filter(props) {
  return (
    <>
      <h2>Filters:</h2>
      <DateFilter />
      <VisualisationFilter />
    </>
  );
}
export default Filter;
