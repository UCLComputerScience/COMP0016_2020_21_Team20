import { shallow, mount } from 'enzyme';
import React from 'react';
import { Button } from 'rsuite';

import AlertDialog from './AlertDialog.js';

describe('AlertDialog', () => {
  it('Renders', () => {
    const wrapper = shallow(<AlertDialog open={false} setOpen={() => null} />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('AlertDialog', () => {
  it('Title displays', () => {
    const testTitle = 'TestTitle';
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} title={testTitle} />
    );

    //× has to be included due to the close button of an AlertDialog
    expect(wrapper.find('AlertDialog').text()).toBe('×' + testTitle);
  });
});

describe('AlertDialog', () => {
  it('Text displays', () => {
    const testText = 'TestText';
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} text={testText} />
    );

    //× has to be included due to the close button of an AlertDialog
    expect(wrapper.find('AlertDialog').text()).toBe('×' + testText);
  });
});

describe('AlertDialog', () => {
  it('Content displays', () => {
    const testContent = [<Button>test button</Button>];
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} content={testContent} />
    );

    expect(wrapper.find('Button').text()).toBe('test button');
  });
});

describe('AlertDialog', () => {
  it('Actions are displayed', () => {
    const testActions = [<Button>test button</Button>];
    const wrapper = mount(
      <AlertDialog open={true} setOpen={() => null} actions={testActions} />
    );

    expect(wrapper.find('Button').text()).toBe('test button');
  });
});
