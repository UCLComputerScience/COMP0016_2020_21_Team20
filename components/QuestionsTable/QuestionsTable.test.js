import { shallow, mount } from 'enzyme';
import React from 'react';

import QuestionsTable from './QuestionsTable.js';

describe('QuestionsTable', () => {
  it('renders', () => {
    const wrapper = shallow(<QuestionsTable />);

    expect(wrapper.exists()).toBe(true);
  });

  it('shows headings', () => {
    const wrapper = mount(<QuestionsTable />);

    expect(wrapper.findWhere(n => n.contains('Question body')));
    expect(wrapper.findWhere(n => n.contains('Standard')));
    expect(wrapper.findWhere(n => n.contains('Training URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });

  it('shows add question button', () => {
    const wrapper = mount(<QuestionsTable />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Add new question')
      )
    );
  });
});
