import { shallow, mount } from 'enzyme';
import React from 'react';

import ClinicianJoinCode from './ClinicianJoinCode.js';

describe('ClinicianJoinCode', () => {
  it('renders', () => {
    const wrapper = shallow(<ClinicianJoinCode host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });

  it('has copy button', () => {
    const wrapper = mount(<ClinicianJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });

  it('has re-generate URL button', () => {
    const wrapper = mount(<ClinicianJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });

  it('shows host', () => {
    const testHost = 'example.com';
    const wrapper = mount(<ClinicianJoinCode host={testHost} />);

    expect(wrapper.findWhere(n => n.contains(testHost)));
  });
});
