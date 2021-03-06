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

describe('CirclesAccordion', () => {
  it('Displays circle', () => {
    const wrapper = mount(
      <CirclesAccordion
        circles={[{ name: 'test', color: 'red', percentage: 50 }]}
      />
    );

    expect(wrapper.find('Circle').exists()).toBe(true);
  });
});

describe('CirclesAccordion', () => {
  it('Displays header', () => {
    const wrapper = mount(
      <CirclesAccordion
        circles={[{ name: 'test', color: 'red', percentage: 50 }]}
      />
    );

    expect(wrapper.find('#summary').exists()).toBe(true);
  });
});
