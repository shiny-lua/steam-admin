// next
import Head from 'next/head';
// auth
import GuestGuard from '../../auth/GuestGuard';
// sections
import Register from '../../sections/auth/Register';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title> Register | Steamupgrade Admin Dashboard</title>
      </Head>

      <GuestGuard>
        <Register />
      </GuestGuard>
    </>
  );
}
