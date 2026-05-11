import { SignInForm } from "@/components/auth/SignInForm"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const { error, success } = await searchParams
  return <SignInForm error={error} success={success} />
}
