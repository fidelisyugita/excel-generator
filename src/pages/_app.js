import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css'; // Import your global CSS file if you have one

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
