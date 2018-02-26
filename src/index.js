import React from 'react';
import ReactDOM from 'react-dom';
import RootWidget from './components/RootWidget';

// Fonts & Styles
import './index.css';

Array.prototype.forEach.call(
  document.querySelectorAll('.read2me-widget'),
  (element) => {
    ReactDOM.render(
      <RootWidget voice={element.getAttribute('voice')} />,
      element
    );
  }
);
