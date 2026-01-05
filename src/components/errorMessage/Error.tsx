import React from 'react';
import classNames from 'classnames';

type Props = {
  error: string | null;
  hideError: () => void;
};

export const ErrorMessage: React.FC<Props> = ({ error, hideError }) => {
  return (
    <div
      className={classNames('notification is-danger is-light has-text-weight-normal', {
        hidden: !error,
      })}
    >
      <button type="button" className="delete" onClick={hideError} />
      {error}
    </div>
  );
};