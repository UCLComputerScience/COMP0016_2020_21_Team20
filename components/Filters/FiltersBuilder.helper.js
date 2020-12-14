export const FILTER_TYPES = {
  DATE: 'DATE',
  SEARCH: 'SEARCH',
  VISUALISATION: 'VISUALISATION',
};

export class FiltersBuilderHelper {
  constructor() {
    this.filters = [];
  }

  addSearchFilter() {
    this.filters.push({
      type: FILTER_TYPES.SEARCH,
      value: '',
    });
    return this;
  }

  addVisualisationFilter() {
    this.filters.push({
      type: FILTER_TYPES.VISUALISATION,
      value: '',
    });
    return this;
  }

  addDateRangeFilter() {
    this.filters.push({
      type: FILTER_TYPES.DATE,
      value: [],
    });
    return this;
  }

  provide() {
    return this.filters;
  }
}
