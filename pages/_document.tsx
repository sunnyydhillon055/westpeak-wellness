import { Html, Head, Main, NextScript } from 'next/document';

/* The document for the one pages/ route (see pages/_app.tsx). The language is
   set here because the default document leaves <html> without one. */
export default function Document() {
  return (
    <Html lang="en-CA">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
