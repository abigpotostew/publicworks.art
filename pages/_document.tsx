// pages/_document.js

import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@200&family=Manrope:wght@200;300;400;500;600;700;800&family=Advent+Pro:wght@100;200;300;400;500;600;700&family=Roboto:wght@100;200;300;400;500;600;700&display=swap"
    rel="stylesheet"
      />

      </Head>
      <body>
      <Main />
      <NextScript />
      </body>
      </Html>
  )
  }
}

export default MyDocument