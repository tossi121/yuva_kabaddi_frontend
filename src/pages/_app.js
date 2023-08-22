import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/scss/_app.scss';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/_context/authContext';

const DashboardLayout = dynamic(import('@/components/Layouts/DashboardLayout'));

const layouts = {
  DashboardLayout: DashboardLayout,
  NoLayout: '',
};
function App({ Component, pageProps }) {
  const Layout = layouts[Component.layout] || ((pageProps) => <Component>{pageProps}</Component>);

  return (
    <>
      <Head>
        <title>ELEV8 INDIA SPORTZ PVT LTD</title>
        <meta name="description" content="ELEV8 INDIA SPORTZ PVT LTD" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default App;
