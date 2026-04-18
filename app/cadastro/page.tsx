import { redirect } from 'next/navigation'

export default function CadastroPage() {
  redirect('/entrar?message=Use+sua+conta+Google+para+entrar+ou+criar+sua+conta.')
}
