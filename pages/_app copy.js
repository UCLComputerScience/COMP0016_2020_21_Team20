import './style.css';

import { Provider } from 'next-auth/client';
import { Footer } from '../components';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [currentTheme, setCurrentTheme] = useState(null);

  // To ensure the saved mode is displayed on load
  useEffect(() =>
    toggleTheme(
      window.localStorage.getItem('dark') === 'true' ? 'dark' : 'default'
    )
  );

  const toggleTheme = theme => {
    if (currentTheme && theme === currentTheme.theme) {
      return;
    }

    if (!['default', 'dark'].includes(theme)) {
      if (currentTheme) {
        theme = currentTheme.theme === 'dark' ? 'default' : 'dark';
      } else {
        theme = 'default';
      }
    }

    const link = `./rsuite-${theme}.min.css`;
    setCurrentTheme({ link, theme });
    window.localStorage.setItem('dark', theme === 'dark');
  };

  return (
    <Provider session={pageProps.session}>
      <link
        rel="stylesheet"
        href={currentTheme ? currentTheme.link : '/rsuite-default.min.css'}
      />
      <Component {...pageProps} toggleTheme={toggleTheme} />
      <Footer />
    </Provider>
  );
}

export default MyApp;
