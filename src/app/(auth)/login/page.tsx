'use client'

import AuthForm from "@/components/ui/AuthForm"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <AuthForm isLogin={true} />
        </div>
    )
}