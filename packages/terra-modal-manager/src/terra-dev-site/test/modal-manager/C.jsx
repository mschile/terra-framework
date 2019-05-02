import React from 'react'
import Button from 'terra-button';
import { withDisclosureManager } from 'terra-disclosure-manager';

const C = ({ disclosureManager }) => (
  <div style={{ height: '100%' }}>
    <Button
      text="Dismiss C"
      onClick={() => disclosureManager.dismiss()}
    />
  </div>
);

export default withDisclosureManager(C);
