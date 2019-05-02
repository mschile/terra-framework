import React from 'react'
import C from './C';
import Button from 'terra-button';
import { withDisclosureManager } from 'terra-disclosure-manager';

const B = ({ disclosureManager }) => (
  <div style={{ height: '100%' }}>
    <Button
      text="Disclose C"
      onClick={() => disclosureManager.disclose({
        preferredType: 'modal',
        content: {
          key: 'C',
          component: (
            <C />
          ),
        },
      }).then(({ afterDismiss }) => {
        afterDismiss.then(() => {
          disclosureManager.closeDisclosure();
        });
      })}
    />
  </div>
);

export default withDisclosureManager(B);
