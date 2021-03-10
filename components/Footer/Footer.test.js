import { shallow, mount } from 'enzyme';
import React from 'react';

import Footer from './Footer.js';

describe('Footer', () => {
  it('renders', () => {
    const wrapper = shallow(<Footer />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows share feedback text', () => {
    const wrapper = mount(<Footer />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'a' && n.contains('Share your feedback!')
      )
    );
  });

  it('shows privacy policy link', () => {
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
