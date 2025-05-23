import PatientCard from '@/components/PatientCard';
import Profile from '@/components/profile/Profile';

export default function ProfilePage() {
    return (
        <main className="px-4 sm:px-6 lg:px-8">
            <PatientCard />
            <div className="mt-6 text-xl font-semibold mb-4">
                <Profile />
            </div>
        </main>
    );
}
