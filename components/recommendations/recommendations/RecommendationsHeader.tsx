import React from 'react';
import { EnrichedRecommendation, Patient, Session } from '@/types/types';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPatientDetails } from '@/utils/fetchPatientDetails';
import PdfDownloadButton from './PdfDownloadButton';

type RecommendationsHeaderProps = {
    numRecommendations: number;
    sessionData: Session | undefined;
    enrichedRecommendations: EnrichedRecommendation[];
};

const RecommendationsHeader: React.FC<RecommendationsHeaderProps> = ({
    numRecommendations,
    sessionData,
    enrichedRecommendations,
}) => {
    const { data: session } = useSession();
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const patientId = pathSegments[2];

    const {
        isLoading,
        error,
        data: patient,
    } = useQuery<Patient>({
        queryKey: ['participant', patientId],
        queryFn: () => fetchPatientDetails(patientId, session?.accessToken),
        enabled: !!session?.accessToken,
    });

    return (
        <div className="border-b border-gray-300 -mx-6 flex justify-between pb-8 ">
            <div className="mx-6">
                <h2 className="text-xl font-semibold">Empfehlungen</h2>
                <h3 className="text-xs font-light text-gray-500">
                    {numRecommendations} {numRecommendations === 1 ? 'Empfehlung' : 'Empfehlungen'}
                </h3>
            </div>

            {sessionData && patient && (
                <div className="mx-6">
                    <PdfDownloadButton
                        sessionData={sessionData}
                        enrichedRecommendations={enrichedRecommendations}
                        patient={patient}
                    />
                </div>
            )}
        </div>
    );
};

export default RecommendationsHeader;
