import { SignInForm } from "@/components/auth/SignInForm"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; verified?: string }>
}) {
  const { error, success, verified } = await searchParams
  return <SignInForm error={error} success={success} verified={verified} />
}
