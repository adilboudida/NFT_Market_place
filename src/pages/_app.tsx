import type { AppProps } from 'next/app';
import type { NextPageWithLayout } from '@/types';
// import { Fira_Code } from '@next/font/google';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModalsContainer from '@/components/modal-views/container';
import DrawersContainer from '@/components/drawer-views/container';
import SettingsButton from '@/components/settings/settings-button';
import SettingsDrawer from '@/components/settings/settings-drawer';
import { WalletProvider } from '@/lib/hooks/use-connect';
import 'overlayscrollbars/css/OverlayScrollbars.css';
// base css file
import 'swiper/css';
import '@/assets/css/scrollbar.css';
import '@/assets/css/globals.css';
import '@/assets/css/range-slider.css';

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function AppLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/85 backdrop-blur-sm dark:bg-dark/85">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand dark:border-gray-700 dark:border-t-brand" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Loading...
        </span>
      </div>
    </div>
  );
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        setIsLoading(true);
      }
    };

    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <title>Criptic - React Next Web3 NFT Crypto Dashboard Template</title>
      </Head>
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <WalletProvider>
          {isLoading && <AppLoader />}
          {getLayout(<Component {...pageProps} />)}
          <SettingsButton />
          <SettingsDrawer />
          <ModalsContainer />
          <DrawersContainer />
        </WalletProvider>
      </ThemeProvider>
    </>
  );
}

export default CustomApp;
