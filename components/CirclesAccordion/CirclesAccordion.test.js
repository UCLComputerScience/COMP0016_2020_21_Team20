import { shallow, mount } from 'enzyme';
import React from 'react';

import CirclesAccordion from './CirclesAccordion.js';

describe('CirclesAccordion', () => {
  it('Renders', () => {
    const wrapper = shallow(
      <CirclesAccordion
        circles={[{ name: 'test', color: 'red', percentage: 50 }]}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });
});
