"use client";

import { useAuth } from "@/components/providers/auth-provider";
import {
    KnockProvider,
    KnockFeedProvider,
} from "@knocklabs/react";

export function AppKnockProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // Replace with actual keys via environment variables for production
    const knockPublicKey = process.env.NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY || "pk_test_placeholder";
    const knockFeedId = process.env.NEXT_PUBLIC_KNOCK_FEED_ID || "feed_id_placeholder";

    if (!user) {
        return <>{children}</>;
    }

    return (
        <KnockProvider apiKey={knockPublicKey} userId={user.id}>
            <KnockFeedProvider feedId={knockFeedId}>
                {children}
            </KnockFeedProvider>
        </KnockProvider>
    );
}
