import { shallow, mount } from 'enzyme';
import React from 'react';

import Header from './Header.js';

describe('Header', () => {
  it('renders', () => {
    const wrapper = shallow(<Header toggleTheme={() => null} />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows logo button', () => {
    const wrapper = mount(<Header toggleTheme={() => null} />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('CQ Dashboard')
      )
    );
  });

  it('shows help button', () => {
    const wrapper = mount(<Header toggleTheme={() => null} />);

    expect(wrapper.findWhere(n => n.type() === 'Button' && n.contains('help')));
  });

  it('toggles theme', () => {
    let test = false;
    const wrapper = mount(<Header toggleTheme={() => (test = true)} />);

    wrapper.find('Icon').simulate('click');
    expect(test).toBe(true);
  });
});
