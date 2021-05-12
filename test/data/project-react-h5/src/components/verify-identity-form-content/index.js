import React from 'react';

import './index.less';

export default function VerifyIdentityFormContent(props) {
  const {
    nameValue,
    idValue,
    handelIdChange,
    handelNameChange
  } = props;

  return (
    <div className="verify-identity-form-content">
      <div className="row" style={{ borderBottom: '1px solid #f2f2f2' }}>
        <div className="label">姓名</div>
        <input
          type="text"
          placeholder="请输入姓名"
          id="name-value"
          value={nameValue}
          onChange={handelNameChange}
        />
      </div>

      <div className="row">
        <div className="label">身份证</div>
        <input type="tel"
               placeholder="请输入身份证"
               id="id-value"
               value={idValue}
               onChange={handelIdChange}
        />
      </div>
    </div>
  );
}

