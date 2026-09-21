import { redirect } from 'next/navigation';

export default function ClientPortalPage() {
  // TODO: Implement client authentication and portal
  // For now, redirect to marketing page
  redirect('/?portal=client');
}
