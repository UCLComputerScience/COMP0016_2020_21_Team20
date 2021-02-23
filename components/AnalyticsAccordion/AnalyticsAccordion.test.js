import { shallow, mount } from 'enzyme';
import React from 'react';

import AnalyticsAccordion from './AnalyticsAccordion.js';

describe('AnalyticsAccordion', () => {
  it('Renders', () => {
    const wrapper = shallow(<AnalyticsAccordion />);

    expect(wrapper.exists()).toBe(true);
  });
});

describe('AnalyticsAccordion', () => {
  it('Not done report message', () => {
    const wrapper = mount(
      <AnalyticsAccordion
        data={[{ timestamp: new Date().getTime() - 60 * 60 * 24 * 8 * 1000 }]}
      />
    );

    expect(
      wrapper.findWhere(n =>
        n.contains('You have not completed a self-report in the last week.')
      )
    );
  });
});

describe('AnalyticsAccordion', () => {
  it('Good message', () => {
    const wrapper = mount(
      <AnalyticsAccordion stats={[{ percentage: 90, longName: 'test' }]} />
    );

    expect(
      wrapper.findWhere(n =>
        n.contains(
          'It looks like you are happy that a satisfactory standard has been achieved for: test. Well done! You are hitting the target for these standards. You can help your colleagues regarding these standards.'
        )
      )
    );
  });
});

describe('AnalyticsAccordion', () => {
  it('Neutral message', () => {
    const wrapper = mount(
      <AnalyticsAccordion stats={[{ percentage: 50, longName: 'test' }]} />
    );

    expect(
      wrapper.findWhere(n =>
        n.contains(
          'It looks like there is an opportunity to improve confidence in meeting: test. You may wish to follow the i link (next to each respective question) to resources that you may find helpful.'
        )
      )
    );
  });
});

describe('AnalyticsAccordion', () => {
  it('Bad message', () => {
    const wrapper = mount(
      <AnalyticsAccordion stats={[{ percentage: 50, longName: 'test' }]} />
    );

    expect(
      wrapper.findWhere(n =>
        n.contains(
          'It looks like you are not happy that a satisfactory standard has been achieved for: test. You are strongly advised to further discuss this case with a mentor or colleague to establish what further steps may need to be taken to address this.'
        )
      )
    );
  });
});
