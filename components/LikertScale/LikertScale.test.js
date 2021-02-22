import { shallow, mount } from 'enzyme';
import React from 'react';

import LikertScale from './LikertScale.js';

describe('LikertScale', () => {
  it('Renders', () => {
    const wrapper = shallow(
      <LikertScale
        onChange={value => {
          null;
        }}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });
});

describe('LikertScale', () => {
  it('Clicking option', () => {
    const wrapper = mount(
      <LikertScale
        onChange={value => {
          null;
        }}
      />
    );

    wrapper
      .find('Radio')
      .at(0)
      .simulate('click', { target: { checked: true } });
  });
});
