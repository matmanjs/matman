import React from 'react';

import './index.less';

export default function SectionTitle(props) {
  const { title, css = '' } = props;

  if (!title) {
    return null;
  }

  return (
    <div className={`section-title ${css}`}>{title}</div>
  );
}
