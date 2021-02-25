import { shallow, mount } from 'enzyme';
import React from 'react';

import LineChart from './LineChart.js';

describe('LineChart', () => {
  it('Renders', () => {
    const wrapper = shallow(<LineChart data={null} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('LineChart', () => {
  it('Loading message', () => {
    const wrapper = mount(<LineChart data={null} />);

    expect(wrapper.findWhere(n => n.contains('Loading data...')).exists()).toBe(
      true
    );
  });
});

describe('LineChart', () => {
  it('No results', () => {
    const wrapper = mount(<LineChart data={[]} />);

    expect(
      wrapper
        .findWhere(n =>
          n.contains('Please try setting a broader date range and/or filter.')
        )
        .exists()
    ).toBe(true);
  });
});
