import { shallow, mount } from 'enzyme';
import React from 'react';

import UrlsTable from './UrlsTable.js';

describe('UrlsTable', () => {
  it('renders', () => {
    const wrapper = shallow(<UrlsTable host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows headings', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(wrapper.findWhere(n => n.contains('Question body')));
    expect(wrapper.findWhere(n => n.contains('Standard')));
    expect(wrapper.findWhere(n => n.contains('Training URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });

  it('shows copy button', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });

  it('shows regenerate button', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });

  it('shows host URL', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(n => n.contains('https://example.com/join/clinician/'))
    );
  });
});
