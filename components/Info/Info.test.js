import { shallow, mount } from 'enzyme';
import React from 'react';

import Info from './Info.js';

describe('Info', () => {
  it('Renders', () => {
    const wrapper = shallow(<Info url="http://www.example.com" />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Info', () => {
  it('Correct link', () => {
    const testURL = 'http://www.example.com';
    const wrapper = mount(<Info url={testURL} />);

    expect(wrapper.find('a').prop('href')).toEqual(testURL);
  });
});
