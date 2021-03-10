import { shallow, mount } from 'enzyme';
import React from 'react';

import LeaveDeptButton from './LeaveDeptButton.js';

describe('LeaveDeptButton', () => {
  it('renders', () => {
    const wrapper = shallow(<LeaveDeptButton />);

    expect(wrapper.exists()).toBe(true);
  });

  it('displays text', () => {
    const wrapper = mount(<LeaveDeptButton />);

    expect(wrapper.find('div').text()).toBe('Leave Department');
  });

  it('click displays pop up', () => {
    const wrapper = mount(<LeaveDeptButton />);

    wrapper.find('div').simulate('click');
    expect(
      wrapper.findWhere(n =>
        n.contains('Are you sure you want to leave your department?')
      )
    );
  });
});
