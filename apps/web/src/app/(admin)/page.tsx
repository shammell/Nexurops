import { redirect } from 'next/navigation';

export default function AdminPortalPage() {
  // TODO: Implement admin authentication and portal
  // For now, redirect to marketing page
  redirect('/?portal=admin');
}
