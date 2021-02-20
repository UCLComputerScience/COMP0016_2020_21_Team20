import { shallow, mount } from 'enzyme';
import React from 'react';

import ClinicianJoinCode from './ClinicianJoinCode.js';

describe('ClinicianJoinCode', () => {
  it('Renders', () => {
    const wrapper = shallow(<ClinicianJoinCode host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('ClinicianJoinCode', () => {
  it('Has copy button', () => {
    const wrapper = mount(<ClinicianJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Copy to clipboard')
      )
    );
  });
});

describe('ClinicianJoinCode', () => {
  it('Has re-generate URL button', () => {
    const wrapper = mount(<ClinicianJoinCode host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
  });
});

describe('ClinicianJoinCode', () => {
  it('Shows host', () => {
    const testHost = 'example.com';
    const wrapper = mount(<ClinicianJoinCode host={testHost} />);

    expect(wrapper.findWhere(n => n.contains(testHost)));
  });
});
