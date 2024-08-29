import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LogoutUser } from '@/lib/auth'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    LogoutUser()
    router.push('/login')
  }

  return (
    <Button onClick={handleLogout}>Logout</Button>
  )
}