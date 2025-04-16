import React from 'react';
import { PATH_DASHBOARD, PATH_AUTH } from 'src/routes/paths';

import { useAuthContext } from '../auth/useAuthContext';
import { useRouter } from 'next/router';

export default function HomePage() {
  const { push } = useRouter();

  const { isAuthenticated } = useAuthContext();

  React.useEffect(() => {
    if (isAuthenticated) {
      push(PATH_DASHBOARD.root);
    } else {
      push(PATH_AUTH.login);
    }
  }, [isAuthenticated]);
}
