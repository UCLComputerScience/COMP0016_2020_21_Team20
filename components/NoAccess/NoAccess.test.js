import { shallow, mount } from 'enzyme';
import React from 'react';

import NoAccess from './NoAccess.js';

describe('NoAccess', () => {
  it('Renders', () => {
    const wrapper = shallow(<NoAccess />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('NoAccess', () => {
  it('Info message', () => {
    const wrapper = mount(<NoAccess />);

    expect(
      wrapper.findWhere(n => n.contains('You do not have access to this page'))
    );
  });
});

describe('NoAccess', () => {
  it('Home page button', () => {
    const wrapper = mount(<NoAccess />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Go to home page')
      )
    );
  });
});
