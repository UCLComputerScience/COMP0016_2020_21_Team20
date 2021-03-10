import { shallow } from 'enzyme';
import React from 'react';

import DepartmentsTable from './DepartmentsTable.js';

describe('DepartmentsTable', () => {
  it('renders', () => {
    const wrapper = shallow(<DepartmentsTable host="example.com" />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows URL info', () => {
    const wrapper = shallow(<DepartmentsTable host="example.com" />);

    expect(
      wrapper.findWhere(n =>
        n.contains(
          'Please send these unique URLs to department managers to join the respective departments'
        )
      )
    );
  });

  it('shows add department button', () => {
    const wrapper = shallow(<DepartmentsTable host="example.com" />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Add new department')
      )
    );
  });
});
