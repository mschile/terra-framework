import React from 'react';
import A from './A';
import ModalManager from '../../../ModalManager';

const ModalManagerAfterDismiss = () => (
  <div style={{ height: '100%' }}>
    <ModalManager>
      <A />
    </ModalManager>
  </div>
);

export default ModalManagerAfterDismiss;
