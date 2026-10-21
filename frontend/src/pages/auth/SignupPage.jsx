import SignupForm from '../../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary-soft/50 via-cream to-accent-soft/40 relative">
      <div className="absolute top-10 right-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <SignupForm />
    </div>
  );
}
