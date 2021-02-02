import Head from 'next/head';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useSession } from 'next-auth/client';

import styles from './help.module.css';
import { Header } from '../components';

function Help({ toggleTheme }) {
  const [session] = useSession();
  const [numPages, setNumPages] = useState(null);

  return (
    <div>
      <Head>
        <title>Help</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      <Document
        className={styles.pdf}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        file="/user-docs.pdf">
        {numPages &&
          Array.from(Array(numPages), (p, i) => (
            <Page key={i} pageNumber={i + 1} />
          ))}
      </Document>
    </div>
  );
}

export default Help;
