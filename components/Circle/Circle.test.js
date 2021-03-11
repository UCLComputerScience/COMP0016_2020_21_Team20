import { shallow, mount } from 'enzyme';
import React from 'react';

import Circle from './Circle.js';

describe('Circle', () => {
  it('renders', () => {
    const wrapper = shallow(<Circle name="test" color="red" percentage={50} />);

    expect(wrapper.exists()).toBe(true);
  });

  it('displays the name and percentage', () => {
    const testName = 'name';
    const testPercentage = 50;
    const wrapper = mount(
      <Circle name={testName} color="red" percentage={testPercentage} />
    );

    expect(wrapper.find('Circle').text()).toBe(testName + testPercentage + '%');
  });

  it('renders the correct color', () => {
    const testColor = 'red';
    const wrapper = mount(
      <Circle name="test" color={testColor} percentage={50} />
    );

    expect(wrapper.find('Circle').prop('color')).toEqual(testColor);
  });
});
