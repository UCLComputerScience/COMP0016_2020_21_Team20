import { shallow, mount } from 'enzyme';
import React from 'react';

import QuestionsTable from './QuestionsTable.js';

describe('QuestionsTable', () => {
  it('Renders', () => {
    const wrapper = shallow(<QuestionsTable />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('QuestionsTable', () => {
  it('Headings', () => {
    const wrapper = mount(<QuestionsTable />);

    expect(wrapper.findWhere(n => n.contains('Question body')));
    expect(wrapper.findWhere(n => n.contains('Standard')));
    expect(wrapper.findWhere(n => n.contains('Training URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });
});

describe('QuestionsTable', () => {
  it('Add question button', () => {
    const wrapper = mount(<QuestionsTable />);

    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Add new question')
      )
    );
  });
});
