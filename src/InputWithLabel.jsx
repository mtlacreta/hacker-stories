import * as React from 'react';

const InputWithLabel = ({
    id,
    value,
    isFocused,
    type = "text",
    onInputChange,
    children,
  }) => {
  
    return (
      <>
        <label htmlFor={id}>{children}</label>
        &nbsp;
        <input
          autoFocus={isFocused}
          id={id}
          type={type}
          onChange={onInputChange}
          value={value}
        />
      </>
    );
  };

  export { InputWithLabel };
  