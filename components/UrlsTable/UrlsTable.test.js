import { shallow, mount } from 'enzyme';
import React from 'react';

import UrlsTable from './UrlsTable.js';

describe('UrlsTable', () => {
  it('Renders', () => {
    const wrapper = shallow(<UrlsTable host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('UrlsTable', () => {
  it('Headings', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(wrapper.findWhere(n => n.contains('Question body')));
    expect(wrapper.findWhere(n => n.contains('Standard')));
    expect(wrapper.findWhere(n => n.contains('Training URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });
});

describe('UrlsTable', () => {
  it('Copy button', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });
});

describe('UrlsTable', () => {
  it('Re generate button', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });
});

describe('UrlsTable', () => {
  it('Host URL', () => {
    const wrapper = mount(<UrlsTable host="example.com" />);

    expect(
      wrapper.findWhere(n => n.contains('https://example.com/join/clinician/'))
    );
  });
});
