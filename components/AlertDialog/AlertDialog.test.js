import { shallow, mount } from 'enzyme';
import React from 'react';
import { Button } from 'rsuite';

import AlertDialog from './AlertDialog.js';

describe('AlertDialog', () => {
  it('renders', () => {
    const wrapper = shallow(<AlertDialog open={false} setOpen={() => null} />);

    expect(wrapper.exists()).toBe(true);
  });

  it('displays title', () => {
    const testTitle = 'TestTitle';
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} title={testTitle} />
    );

    //× has to be included due to the close button of an AlertDialog
    expect(wrapper.find('AlertDialog').text()).toBe('×' + testTitle);
  });

  it('displays text', () => {
    const testText = 'TestText';
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} text={testText} />
    );

    //× has to be included due to the close button of an AlertDialog
    expect(wrapper.find('AlertDialog').text()).toBe('×' + testText);
  });

  it('displays content', () => {
    const testContent = [<Button key="button">test button</Button>];
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} content={testContent} />
    );

    expect(wrapper.find('Button').text()).toBe('test button');
  });

  it('displays actions', () => {
    const testActions = [<Button key="button">test button</Button>];
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} actions={testActions} />
    );

    expect(wrapper.find('Button').text()).toBe('test button');
  });
});
