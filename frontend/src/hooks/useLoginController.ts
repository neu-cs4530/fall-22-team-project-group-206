import assert from 'assert';
import { useContext } from 'react';
import LoginControllerContext, { LoginController } from '../contexts/LoginControllerContext';

/**
 * Use this hook to access the current LoginController.
 */
export default function useLoginController(): LoginController {
  const ctx = useContext(LoginControllerContext);
  assert(ctx, 'LoginController context should be defined.');
  return ctx;
}
