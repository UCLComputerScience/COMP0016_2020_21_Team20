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

    expect(
      wrapper.findWhere(
        n => n.type() === 'a' && n.contains('Share your feedback!')
      )
    );
  });
});

describe('Footer', () => {
  it('Has privacy policy link', () => {
    const wrapper = mount(<Footer />);

    expect(
      wrapper.findWhere(
        n =>
          n.type() === 'a' &&
          n.prop('href') === 'https://www.carefulai.com/privacy-policy.html'
      )
    );
  });
});
