import { shallow, mount } from 'enzyme';
import React from 'react';

import LikertScale from './LikertScale.js';

describe('LikertScale', () => {
  it('renders', () => {
    const wrapper = shallow(<LikertScale onChange={() => null} />);

    expect(wrapper.exists()).toBe(true);
  });

  it('clicking option works', () => {
    const wrapper = mount(<LikertScale onChange={() => null} />);

    wrapper
      .find('Radio')
      .at(0)
      .simulate('click', { target: { checked: true } });
  });
});
