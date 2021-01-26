import 'rsuite/dist/styles/rsuite-default.min.css';
import './style.css';

import { Provider } from 'next-auth/client';
import { Footer } from '../components';

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
      <Footer />
    </Provider>
  );
}

export default MyApp;
