import { shallow, mount } from 'enzyme';
import React from 'react';

import Circle from './Circle.js';

describe('Circle', () => {
  it('Renders', () => {
    const wrapper = shallow(<Circle name="test" color="red" percentage={50} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Circle', () => {
  it('Name and percentage displays', () => {
    const testName = 'name';
    const testPercentage = 50;
    const wrapper = mount(
      <Circle name={testName} color="red" percentage={testPercentage} />
    );

    expect(wrapper.find('Circle').text()).toBe(testName + testPercentage + '%');
  });
});

describe('Circle', () => {
  it('Correct color', () => {
    const testColor = 'red';
    const wrapper = mount(
      <Circle name="test" color={testColor} percentage={50} />
    );

    expect(wrapper.find('Circle').prop('color')).toEqual(testColor);
  });
});
