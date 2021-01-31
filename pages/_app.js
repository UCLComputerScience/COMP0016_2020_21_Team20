import 'rsuite/dist/styles/rsuite-default.min.css';
import './style.css';

import { Provider } from 'next-auth/client';
import { Footer } from '../components';
import { useEffect, useState } from 'react';
import { Button } from 'rsuite';

const LoadCssFile = (href, theme) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.theme = theme;
  document.head.appendChild(link);
  return link;
};

function MyApp({ Component, pageProps }) {
  const [currentLink, setCurrentLink] = useState(null);

  // To ensure the saved mode is displayed on load
  useEffect(() =>
    toggleTheme(
      window.localStorage.getItem('dark') === 'true' ? 'dark' : 'default'
    )
  );

  const toggleTheme = theme => {
    if (
      (!currentLink && theme === 'default') ||
      (currentLink && theme === currentLink.dataset.theme)
    ) {
      return;
    }

    if (!['default', 'dark'].includes(theme)) {
      if (currentLink) {
        theme = currentLink.dataset.theme === 'dark' ? 'default' : 'dark';
      } else {
        theme = 'default';
      }
    }

    const link = LoadCssFile(`./rsuite-${theme}.min.css`, theme);
    link.onload = () => {
      if (currentLink) currentLink.parentNode.removeChild(currentLink);
      setCurrentLink(link);
      window.localStorage.setItem('dark', theme === 'dark');
    };
  };

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} toggleTheme={toggleTheme} />
      <Footer />
    </Provider>
  );
}

export default MyApp;
