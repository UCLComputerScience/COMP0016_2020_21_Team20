import { shallow, mount } from 'enzyme';
import React from 'react';

import Header from './Header.js';

describe('Header', () => {
  it('Renders', () => {
    const wrapper = shallow(<Header toggleTheme={() => null} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Header', () => {
  it('Logo button', () => {
    const wrapper = mount(<Header toggleTheme={() => null} />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('CQ Dashboard')
      )
    );
  });
});

describe('Header', () => {
  it('Help button', () => {
    const wrapper = mount(<Header toggleTheme={() => null} />);

    expect(wrapper.findWhere(n => n.type() === 'Button' && n.contains('help')));
  });
});

describe('Header', () => {
  it('Toggling theme', () => {
    let test = false;
    const wrapper = mount(<Header toggleTheme={() => (test = true)} />);

    wrapper.find('Icon').simulate('click');
    expect(test).toBe(true);
  });
});
