import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get('admin_token')?.value
  if (!token) {
    redirect('/?login=required')
  }
  try {
    await verifyToken(token)
  } catch {
    redirect('/?login=expired')
  }
  return <>{children}</>
}
