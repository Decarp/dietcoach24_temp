import ClientWrapper from '@/components/ClientWrapper';
import Header from '@/components/Header';
import Provider from '@/providers/Providers';
import AuthProvider from '@/providers/SessionProvider';
import { CounterStoreProvider } from '@/providers/useStoreProvider';
import 'dotenv/config';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DietCoach',
    description: "Analyze your patient's food shopping data and provide personalized recommendations.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(h,o,t,j,a,r){
                        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                        h._hjSettings={hjid:5114112,hjsv:6};
                        a=o.getElementsByTagName('head')[0];
                        r=o.createElement('script');r.async=1;
                        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                        a.appendChild(r);
                    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
                    }}
                />
            </head>
            <body className={inter.className + ' h-full'}>
                <AuthProvider>
                    <Provider>
                        <CounterStoreProvider>
                            <ClientWrapper>
                                <Header>{children}</Header>
                                <Toaster position="bottom-center" />
                            </ClientWrapper>
                        </CounterStoreProvider>
                    </Provider>
                </AuthProvider>
            </body>
        </html>
    );
}
