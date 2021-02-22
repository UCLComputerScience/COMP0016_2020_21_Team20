import { shallow, mount } from 'enzyme';
import React from 'react';

import ProfileButton from './ProfileButton.js';

describe('ProfileButton', () => {
  it('Renders', () => {
    const wrapper = shallow(<ProfileButton />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('ProfileButton', () => {
  it('Info text', () => {
    const wrapper = mount(<ProfileButton />);

    expect(wrapper.findWhere(n => n.contains('Your account')));
  });
});
