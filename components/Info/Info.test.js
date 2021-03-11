import { shallow, mount } from 'enzyme';
import React from 'react';

import Info from './Info.js';

describe('Info', () => {
  it('renders', () => {
    const wrapper = shallow(<Info url="http://www.example.com" />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows correct link', () => {
    const testURL = 'http://www.example.com';
    const wrapper = mount(<Info url={testURL} />);

    expect(wrapper.find('a').prop('href')).toEqual(testURL);
  });
});
