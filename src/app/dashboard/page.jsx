import AuthGuard from "@/components/auth/AuthGuard";
import NotesList from "@/components/notes/NotesList";

export default function Dashboard() {
  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto py-10 px-4">
        <NotesList />
      </div>
    </AuthGuard>
  )
}
