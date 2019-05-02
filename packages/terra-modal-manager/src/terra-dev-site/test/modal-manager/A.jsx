import React from 'react'
import B from './B';
import Button from 'terra-button';
import { withDisclosureManager } from 'terra-disclosure-manager';

const A = ({ disclosureManager }) => (
  <div style={{ height: '100%' }}>
    <Button
      text="Disclose B"
      onClick={() => disclosureManager.disclose({
        preferredType: 'modal',
        content: {
          key: 'B',
          component: (
            <B />
          ),
        },
      })}
    />
  </div>
);

export default withDisclosureManager(A);
