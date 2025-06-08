// frontend/pages/_document.jsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MalvaderDocument extends Document {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          {/* Charset e viewport */}
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          {/* Fonte Roboto via Google Fonts */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
            rel="stylesheet"
          />

          {/* CSS global, favicon etc */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/styles/globals.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MalvaderDocument;
