import React from 'react';
import PropTypes from 'prop-types';
import './Modal.scss';

export const Modal = ({ active, children }) => (
  <div
    className={active ? 'Modal active' : 'Modal'}
    aria-hidden="true"
  >
    <div
      className={active ? 'Modal__content active' : 'Modal__content'}
      onClick={e => e.stopPropagation()}
      aria-hidden="true"
    >
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
