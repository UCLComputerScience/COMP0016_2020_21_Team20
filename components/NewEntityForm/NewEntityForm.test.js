import { mount } from 'enzyme';
import React from 'react';

import NewEntityForm from './NewEntityForm.js';

const wrapper = mount(
  <NewEntityForm hospital onError={() => null} onSuccess={() => null} />
);

describe('NewEntityForm', () => {
  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('has name input', () => {
    expect(wrapper.findWhere(n => n.type() === 'input' && n.name() === 'name'));
  });

  it('has health board select menu', () => {
    expect(wrapper.findWhere(n => n.type() === 'a' && n.contains('Select')));
  });
});
