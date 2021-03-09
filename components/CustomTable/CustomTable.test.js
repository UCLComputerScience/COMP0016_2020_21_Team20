import { mount } from 'enzyme';
import React from 'react';

import { Button, Icon } from 'rsuite';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import CustomTable from './CustomTable.js';

const wrapper = mount(
  <CustomTable
    host="example.com"
    data={['']}
    columns={[
      {
        id: 'department',
        label: 'Department Name',
        width: 'auto',
        render: () => null,
      },
      {
        id: 'url',
        label: 'Join URL',
        width: 'auto',
        render: () => null,
      },
      { id: 'actions', label: 'Actions', width: 'auto' },
    ]}
    renderActionCells={() => {
      return (
        <div>
          <CopyToClipboard text="test">
            <Button appearance="primary" onClick={() => null}>
              <Icon icon="clone" />
            </Button>
          </CopyToClipboard>
          <Button appearance="primary" onClick={() => null}>
            Re-generate URL
          </Button>
          <Button color="red" onClick={() => null}>
            Delete
          </Button>
        </div>
      );
    }}
    editing={false}
  />
);

describe('CustomTable', () => {
  it('Renders', () => {
    expect(wrapper.exists()).toBe(true);
  });
});

describe('CustomTable', () => {
  it('Headings', () => {
    expect(wrapper.findWhere(n => n.contains('Department Name')));
    expect(wrapper.findWhere(n => n.contains('Join URL')));
    expect(wrapper.findWhere(n => n.contains('Actions')));
  });
});

describe('CustomTable', () => {
  it('Actions', () => {
    expect(wrapper.find('CopyToClipboard').exists());
    expect(
      wrapper.findWhere(
        n => n.type() === 'Button' && n.contains('Re-generate URL')
      )
    );
    expect(
      wrapper.findWhere(n => n.type() === 'Button' && n.contains('Delete'))
    );
  });
});
