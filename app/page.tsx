'use client';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            // Redirect to /patients if the user is authenticated
            router.push('/patients');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <main className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-68px)]">
                    <Spinner className="mt-4" />
                </div>
            </main>
        );
    }

    const handleRegisterClick = () => {
        router.push('/register');
    };

    return (
        <main className="px-4 py-8 sm:px-6 lg:px-8">
            <div className="bg-white h-screen -m-8 p-8 border-x border-b border-gray-300 h-[calc(100vh-68px)]">
                <h1 className="text-2xl font-semibold mb-6">Willkommen</h1>
                <hr className="border-gray-300 -mx-8" />
                <br />
                <div className="space-x-4">
                    <Button onClick={() => signIn()} icon={<ArrowRightEndOnRectangleIcon className="h-5 w-5" />}>
                        Einloggen
                    </Button>
                    <Button onClick={handleRegisterClick} icon={<UserPlusIcon className="h-5 w-5" />}>
                        Registrieren
                    </Button>
                </div>
            </div>
        </main>
    );
}
