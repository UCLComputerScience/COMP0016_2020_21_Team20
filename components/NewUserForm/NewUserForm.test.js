import { mount } from 'enzyme';
import React from 'react';

import NewUserForm from './NewUserForm.js';

const wrapper = mount(
  <NewUserForm
    userType="health_board"
    onError={() => null}
    onSuccess={() => null}
  />
);

describe('NewUserForm', () => {
  it('renders', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('generates random password', () => {
    wrapper.find('#generatePassword').first().simulate('click');
    expect(wrapper.find('input[name="password"]').prop('value')).toHaveLength(
      15
    );
  });

  it('has email input', () => {
    expect(
      wrapper.findWhere(n => n.type() === 'input' && n.name() === 'email')
    );
  });

  it('has health board select menu', () => {
    expect(wrapper.findWhere(n => n.type() === 'a' && n.contains('Select')));
  });
});
