import { shallow, mount } from 'enzyme';
import React from 'react';

import LoginMessage from './LoginMessage.js';

describe('LoginMessage', () => {
  it('Renders', () => {
    const wrapper = shallow(<LoginMessage />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('LoginMessage', () => {
  it('Info message', () => {
    const wrapper = mount(<LoginMessage />);

    expect(
      wrapper.findWhere(n =>
        n.contains(
          'You must login or register to use the Care Quality Dashboard.'
        )
      )
    );
  });
});

describe('LoginMessage', () => {
  it('Login/register button', () => {
    const wrapper = mount(<LoginMessage />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Login or Register')
      )
    );
  });
});
