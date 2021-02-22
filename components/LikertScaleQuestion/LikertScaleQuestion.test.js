import { shallow, mount } from 'enzyme';
import React from 'react';

import LikertScaleQuestion from './LikertScaleQuestion.js';

describe('LikertScaleQuestion', () => {
  it('Renders', () => {
    const wrapper = shallow(
      <LikertScaleQuestion
        onChange={value => {
          null;
        }}
        questionNumber={1}
        questionUrl="http://www.example.com"
        question="This is a good test question?"
        showError={false}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });
});

describe('LikertScaleQuestion', () => {
  it('Displays question', () => {
    const testQuestion = 'This is a good test question?';
    const testNumber = 1;
    const wrapper = mount(
      <LikertScaleQuestion
        onChange={value => {
          null;
        }}
        questionNumber={testNumber}
        questionUrl="http://www.example.com"
        question={testQuestion}
        showError={false}
      />
    );

    expect(
      wrapper.findWhere(n => n.contains(testNumber + '. ' + testQuestion))
    );
  });
});
