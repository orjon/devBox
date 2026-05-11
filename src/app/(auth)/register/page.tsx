import { RegisterForm } from "@/components/auth/RegisterForm"

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return <RegisterForm error={error} />
}
