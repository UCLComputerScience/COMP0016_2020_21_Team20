import { shallow, mount } from 'enzyme';
import React from 'react';

import WordCloud from './WordCloud.js';

describe('WordCloud', () => {
  it('renders', () => {
    const wrapper = shallow(<WordCloud words={null} />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows loading message', () => {
    const wrapper = mount(<WordCloud words={null} />);

    expect(wrapper.findWhere(n => n.contains('Loading data...')).exists()).toBe(
      true
    );
  });

  it('shows no results', () => {
    const wrapper = mount(<WordCloud words={[]} />);

    expect(
      wrapper
        .findWhere(n =>
          n.contains('Please try setting a broader date range and/or filter.')
        )
        .exists()
    ).toBe(true);
  });
});
