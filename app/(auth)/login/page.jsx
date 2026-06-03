import { signIn } from '@/lib/auth.js'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl border border-gray-200 w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Calendar Reflect</h1>
        <p className="text-gray-500 text-sm mb-8">
          Your calendar tells you what you planned.<br />
          We tell you what your patterns mean.
        </p>
        <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/' }) }}>
          <button
            type="submit"
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  )
}
