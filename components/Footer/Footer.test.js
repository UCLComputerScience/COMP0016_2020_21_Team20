import { shallow, mount } from 'enzyme';
import React from 'react';

import Footer from './Footer.js';

describe('Footer', () => {
  it('Renders', () => {
    const wrapper = shallow(<Footer />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('Footer', () => {
  it('Has share feedback text', () => {
    const wrapper = mount(<Footer />);

    expect(wrapper.find('a').at(2).text()).toBe('Share your feedback!');
  });
});

describe('Footer', () => {
  it('Has privacy policy link', () => {
    const wrapper = mount(<Footer />);

    expect(wrapper.find('a').at(1).prop('href')).toEqual(
      'https://www.carefulai.com/privacy-policy.html'
    );
  });
});
