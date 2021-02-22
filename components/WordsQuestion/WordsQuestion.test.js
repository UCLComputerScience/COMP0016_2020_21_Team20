import { shallow, mount } from 'enzyme';
import React from 'react';

import WordsQuestion from './WordsQuestion.js';

describe('WordsQuestion', () => {
  it('Renders', () => {
    const wrapper = shallow(
      <WordsQuestion
        onChange={value => {
          null;
        }}
        questionNumber={1}
        question="Type 't' to test it out"
        suggestedWords={['test', 'test1', 'test2', 'thisTest']}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });
});

describe('WordsQuestion', () => {
  it('Displays question', () => {
    const testQuestion = "Type 't' to test it out";
    const testNumber = 1;
    const wrapper = mount(
      <WordsQuestion
        onChange={value => {
          null;
        }}
        questionNumber={testNumber}
        question={testQuestion}
        suggestedWords={['test', 'test1', 'test2', 'thisTest']}
      />
    );

    wrapper.findWhere(n => n.contains(testNumber + '. ' + testQuestion));
  });
});

describe('WordsQuestion', () => {
  it('Auto complete', () => {
    const testQuestion = "Type 't' to test it out";
    const testNumber = 1;
    const testSuggestedWord = 'thisTest';
    const wrapper = mount(
      <WordsQuestion
        onChange={value => {
          null;
        }}
        questionNumber={testNumber}
        question={testQuestion}
        suggestedWords={[testSuggestedWord]}
      />
    );

    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: 't' } });
    expect(wrapper.findWhere(n => n.contains(testSuggestedWord)));
  });
});
