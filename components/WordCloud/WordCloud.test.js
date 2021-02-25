import { shallow, mount } from 'enzyme';
import React from 'react';

import WordCloud from './WordCloud.js';

describe('WordCloud', () => {
  it('Renders', () => {
    const wrapper = shallow(<WordCloud words={null} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('WordCloud', () => {
  it('Loading message', () => {
    const wrapper = mount(<WordCloud words={null} />);

    expect(wrapper.findWhere(n => n.contains('Loading data...')).exists()).toBe(
      true
    );
  });
});

describe('WordCloud', () => {
  it('No results', () => {
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
