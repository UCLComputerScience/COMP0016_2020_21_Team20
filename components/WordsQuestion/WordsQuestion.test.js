import { shallow, mount } from 'enzyme';
import React from 'react';

import WordsQuestion from './WordsQuestion.js';

describe('WordsQuestion', () => {
  it('renders', () => {
    const wrapper = shallow(
      <WordsQuestion
        onChange={() => null}
        questionNumber={1}
        question="Type 't' to test it out"
        suggestedWords={['test', 'test1', 'test2', 'thisTest']}
      />
    );

    expect(wrapper.exists()).toBe(true);
  });

  it('displays question', () => {
    const testQuestion = "Type 't' to test it out";
    const testNumber = 1;
    const wrapper = mount(
      <WordsQuestion
        onChange={() => null}
        questionNumber={testNumber}
        question={testQuestion}
        suggestedWords={['test', 'test1', 'test2', 'thisTest']}
      />
    );

    wrapper.findWhere(n => n.contains(testNumber + '. ' + testQuestion));
  });

  it('auto completes', () => {
    const testQuestion = "Type 't' to test it out";
    const testNumber = 1;
    const testSuggestedWord = 'thisTest';
    const wrapper = mount(
      <WordsQuestion
        onChange={() => null}
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
