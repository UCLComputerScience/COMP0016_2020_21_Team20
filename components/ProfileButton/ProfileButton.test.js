import { shallow, mount } from 'enzyme';
import React from 'react';

import ProfileButton from './ProfileButton.js';

describe('ProfileButton', () => {
  it('renders', () => {
    const wrapper = shallow(<ProfileButton />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows your account button', () => {
    const wrapper = mount(<ProfileButton />);

    expect(wrapper.findWhere(n => n.contains('Your account')));
  });
});
