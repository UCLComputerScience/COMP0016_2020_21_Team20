import { shallow } from 'enzyme';
import React from 'react';
import { Roles } from '../../lib/constants.js';

import UrlsTable from './UrlsTable.js';

describe('UrlsTable', () => {
  const wrapper = shallow(
    <UrlsTable
      session={{ user: { roles: Roles.USER_TYPE_DEPARTMENT } }}
      host="example.com"
    />
  );

  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('shows headings', () => {
    expect(wrapper.findWhere(n => n.contains('Question body')));
    expect(wrapper.findWhere(n => n.contains('Standard')));
    expect(wrapper.findWhere(n => n.contains('Training URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });

  it('shows copy button', () => {
    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });

  it('shows regenerate button', () => {
    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });

  it('shows host URL', () => {
    expect(
      wrapper.findWhere(n => n.contains('https://example.com/join/clinician/'))
    );
  });
});
