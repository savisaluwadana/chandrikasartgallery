// not-found.tsx must be a Server Component at root level in Next.js App Router.
// Client-side animations are moved to a separate Client Component.
import NotFoundClient from '@/components/not-found-client';

export default function NotFound() {
    return <NotFoundClient />;
}
