import 'rsuite/dist/styles/rsuite-default.min.css';
import './style.css';

import { Provider } from 'next-auth/client';
import { Footer } from '../components';
import { useEffect, useState } from 'react';
import { Container, Content } from 'rsuite';

const LoadCssFile = (href, theme) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.theme = theme;
  document.head.appendChild(link);
  document.body.dataset.theme = theme;
  document.body.classList.remove(theme === 'default' ? 'dark' : 'default');
  document.body.classList.add(theme);
  return link;
};

/**
 * This component class is the base class for every page of the site
 * This functionality is provided by Next.js. It should be used for global configuration.
 * At the moment, it handles the dark-mode/light-mode theme switching, and adding the Footer to
 * every single page.
 *
 * @param Component the actual component to be rendered
 * @param pageProps the actual props to pass to the desired component
 */
function App({ Component, pageProps }) {
  const [currentLink, setCurrentLink] = useState(null);

  // To ensure the saved mode is displayed on load
  useEffect(() =>
    toggleTheme(
      window.localStorage.getItem('dark') === 'true' ? 'dark' : 'default'
    )
  );

  const toggleTheme = theme => {
    if (currentLink && theme === currentLink.dataset.theme) {
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

  // Note: content min-height is calculated by subtracting the header height and footer height
  return (
    <Provider session={pageProps.session}>
      <Container>
        <Content style={{ minHeight: 'calc(100vh - 65px)' }}>
          <Component {...pageProps} toggleTheme={toggleTheme} />
        </Content>
        <Footer />
      </Container>
    </Provider>
  );
}

export default App;
