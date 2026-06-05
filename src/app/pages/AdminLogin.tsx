import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, AlertCircle, Loader2, GraduationCap, Eye, EyeOff, Shield, BadgeCheck, RotateCcw, KeyRound } from 'lucide-react';
import { requestPasswordReset, resetPassword, signIn, verifyEmailCode } from '../lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

type LoginStep = 'credentials' | 'verification' | 'reset';

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [resetId, setResetId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedResetEmail, setMaskedResetEmail] = useState('');
  const [activeStep, setActiveStep] = useState<LoginStep>('credentials');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const startVerification = async () => {
    setError('');
    if (!email.trim()) { setError('Email address is required'); return false; }
    if (!email.includes('@')) { setError('Please enter a valid email address'); return false; }
    if (!password) { setError('Password is required'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return false; }

    const { data, error: signInError } = await signIn(email.trim(), password);
    if (signInError) {
      const msg = signInError.message?.toLowerCase();
      setError(msg?.includes('invalid') || msg?.includes('credentials')
        ? 'Invalid email or password. Please check your credentials.'
        : signInError.message || 'Login failed. Please try again.');
      toast.error('Authentication failed');
      return false;
    }

    if (data?.session) {
      toast.success('Welcome back, Admin!');
      navigate('/admin/dashboard');
      return true;
    }

    if (data?.requiresVerification) {
      setChallengeId(data.challengeId);
      setMaskedEmail(data.email);
      setCode('');
      setActiveStep('verification');
      toast.success('Verification code sent');
      return true;
    }

    setError('Login failed. Please try again.');
    return false;
  };

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await startVerification();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!challengeId) { setError('Please complete the email and password step first.'); return; }
    if (!/^\d{6}$/.test(code.trim())) { setError('Enter the 6-digit verification code.'); return; }

    setLoading(true);
    try {
      const { data, error: verifyError } = await verifyEmailCode(challengeId, code.trim());
      if (verifyError) {
        setError(verifyError.message || 'Verification failed. Please try again.');
        toast.error('Verification failed');
      } else if (data?.session) {
        toast.success('Email verified. Welcome back!');
        navigate('/admin/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      await startVerification();
    } finally {
      setResending(false);
    }
  };

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetEmail.trim()) { setError('Email address is required'); return; }
    if (!resetEmail.includes('@')) { setError('Please enter a valid email address'); return; }

    setLoading(true);
    try {
      const { data, error: resetError } = await requestPasswordReset(resetEmail.trim());
      if (resetError) {
        setError(resetError.message || 'Password reset request failed.');
        toast.error('Reset request failed');
      } else {
        setResetId(data?.resetId || '');
        setMaskedResetEmail(data?.email || resetEmail.trim());
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        toast.success('Password reset code sent');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!resetId) { setError('Request a password reset code first.'); return; }
    if (!/^\d{6}$/.test(resetCode.trim())) { setError('Enter the 6-digit reset code.'); return; }
    if (newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(resetId, resetCode.trim(), newPassword);
      if (resetError) {
        setError(resetError.message || 'Password reset failed.');
        toast.error('Password reset failed');
      } else {
        setPassword('');
        setResetId('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveStep('credentials');
        toast.success('Password updated. Sign in with your new password.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#0A2540]">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A623]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F5A623] rounded-2xl shadow-2xl mb-5 rotate-3">
            <GraduationCap className="w-11 h-11 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-1">ARYAVARTA</h1>
          <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secure Admin Portal</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3f6f] px-8 py-5">
            <h2 className="text-xl font-bold text-white">Admin Sign In</h2>
            <p className="text-slate-300 text-sm mt-0.5">Email, password, verification, and reset support</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            <Tabs value={activeStep} onValueChange={(value) => setActiveStep(value as LoginStep)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="verification" disabled={!challengeId}>Verify Email</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="credentials">
                <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 placeholder:text-slate-400 text-slate-800"
                        placeholder="Enter email address"
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setActiveStep('reset');
                          setError('');
                        }}
                        className="text-xs font-semibold text-[#0A2540] hover:text-[#F5A623] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 placeholder:text-slate-400 text-slate-800"
                        placeholder="Enter password"
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white py-3.5 rounded-xl font-bold hover:from-[#E09512] hover:to-[#cc8510] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#F5A623]/30 text-base"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                    Continue
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="verification">
                <form onSubmit={handleVerificationSubmit} className="space-y-5">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="w-5 h-5 text-[#F5A623]" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Check your email</p>
                        <p className="text-xs text-slate-500 mt-0.5">Code sent to {maskedEmail || 'your admin email'}.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-lg tracking-[0.35em] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 text-slate-800"
                      placeholder="000000"
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white py-3.5 rounded-xl font-bold hover:from-[#E09512] hover:to-[#cc8510] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#F5A623]/30 text-base"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BadgeCheck className="w-5 h-5" />}
                    Verify and Sign In
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading || resending}
                    className="w-full py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-[#0A2540] hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {resending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Resend Code
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <div className="space-y-6">
                  <form onSubmit={handleResetRequest} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Admin Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 placeholder:text-slate-400 text-slate-800"
                          placeholder="Enter admin email"
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 border border-slate-200 rounded-xl text-sm font-semibold text-[#0A2540] hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading && !resetId ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Send Reset Code
                    </button>
                  </form>

                  {resetId && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <KeyRound className="w-5 h-5 text-[#F5A623]" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">Reset code sent</p>
                            <p className="text-xs text-slate-500 mt-0.5">Use the code sent to {maskedResetEmail || 'your admin email'}.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Reset Code</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-center text-lg tracking-[0.35em] focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 text-slate-800"
                          placeholder="000000"
                          disabled={loading}
                          autoComplete="one-time-code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 placeholder:text-slate-400 text-slate-800"
                            placeholder="Enter new password"
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            tabIndex={-1}
                            aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                          >
                            {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 focus:border-[#F5A623] transition-all bg-slate-50 placeholder:text-slate-400 text-slate-800"
                            placeholder="Confirm new password"
                            disabled={loading}
                            autoComplete="new-password"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#F5A623] to-[#E09512] text-white py-3.5 rounded-xl font-bold hover:from-[#E09512] hover:to-[#cc8510] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-[#F5A623]/30 text-base"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <KeyRound className="w-5 h-5" />}
                        Update Password
                      </button>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">Protected by email verification. Admin access only.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
          <p className="text-xs text-white/70 text-center">
            Use your administrator email and password. A verification code is required before access is granted.
          </p>
        </div>
      </div>
    </div>
  );
}
