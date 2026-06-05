import { useState, useEffect } from 'react';
import { adminSettings } from '../../lib/api';
import { applyAuthSession } from '../../lib/auth';
import { toast } from 'sonner';
import { Save, User, Mail, Bell, Shield, Camera, Loader2, ImagePlus, Lock, BadgeCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

export function AdminSettings({ 
  userEmail, 
  initialName,
  onUpdate 
}: { 
  userEmail: string;
  initialName: string;
  onUpdate: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState(userEmail);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailChangeStep, setEmailChangeStep] = useState<'password' | 'code'>('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailChallengeId, setEmailChallengeId] = useState('');
  const [maskedRegisteredEmail, setMaskedRegisteredEmail] = useState('');
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [settings, setSettings] = useState({
    profileName: initialName || '',
    profilePhoto: '',
    admin_email: userEmail || '',
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: false,
    twoFactorAuth: false,
    theme: 'system'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await adminSettings.get();
      if (!error && data) {
        setSettings(prev => ({ ...prev, ...data, admin_email: data.admin_email || userEmail }));
        setRegisteredEmail(data.admin_email || userEmail);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.admin_email.trim() || !settings.admin_email.includes('@')) {
      toast.error('Please enter a valid admin email');
      return;
    }

    if (settings.admin_email.trim().toLowerCase() !== registeredEmail.trim().toLowerCase()) {
      setEmailChangeStep('password');
      setCurrentPassword('');
      setEmailCode('');
      setEmailChallengeId('');
      setMaskedRegisteredEmail('');
      setEmailDialogOpen(true);
      return;
    }

    setSaving(true);
    try {
      const { error } = await adminSettings.update(settings);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Settings saved successfully');
        onUpdate();
      }
    } catch (e) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChangeRequest = async () => {
    if (!currentPassword) {
      toast.error('Enter your current password');
      return;
    }

    setEmailChangeLoading(true);
    try {
      const { data, error } = await adminSettings.requestEmailChange(
        settings.admin_email.trim(),
        currentPassword,
      );
      if (error) {
        toast.error(error);
        return;
      }

      setEmailChallengeId(data.challengeId);
      setMaskedRegisteredEmail(data.email);
      setEmailCode('');
      setEmailChangeStep('code');
      toast.success('Verification code sent');
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleEmailChangeVerify = async () => {
    if (!/^\d{6}$/.test(emailCode)) {
      toast.error('Enter the 6-digit verification code');
      return;
    }

    setEmailChangeLoading(true);
    try {
      const { data, error } = await adminSettings.verifyEmailChange(emailChallengeId, emailCode);
      if (error) {
        toast.error(error);
        return;
      }

      applyAuthSession(data.token, data.user);
      const newEmail = data.user.email;
      setRegisteredEmail(newEmail);
      setSettings(prev => ({ ...prev, admin_email: newEmail }));
      setEmailDialogOpen(false);

      const { error: settingsError } = await adminSettings.update({
        ...settings,
        admin_email: newEmail,
      });
      if (settingsError) {
        toast.error('Email changed, but other settings could not be saved');
      } else {
        toast.success('Email verified and settings saved');
      }
      onUpdate();
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings({ ...settings, profilePhoto: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0A2540]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0A2540]">Settings</h2>
          <p className="text-slate-500 mt-1 text-sm">Manage your account settings and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0A2540] text-white rounded-xl font-medium hover:bg-[#1a3f6f] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <User className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-bold text-[#0A2540]">Profile Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                    {settings.profilePhoto ? (
                      <img src={settings.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <span className="sr-only">Upload profile photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="Upload profile photo"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0A2540]">Profile Photo</h4>
                  <p className="text-xs text-slate-500 mt-1">Upload a new photo (max 2MB).</p>
                  <label className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors">
                    <ImagePlus className="w-3.5 h-3.5" />
                    Choose Image
                    <span className="sr-only">Choose profile image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="Choose profile image"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="profile-name" className="text-sm font-semibold text-[#0A2540]">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    value={settings.profileName}
                    onChange={(e) => setSettings({ ...settings, profileName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                    placeholder="Admin Name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email-address" className="text-sm font-semibold text-[#0A2540]">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="email-address"
                      type="email"
                      value={settings.admin_email}
                      onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition-all"
                      placeholder="admin@example.com"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">Changing this updates your admin login email.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-bold text-[#0A2540]">Notification Preferences</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 id="email-notifications-label" className="font-semibold text-sm text-[#0A2540]">Email Notifications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive alerts when new applications are submitted.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="email-notifications-toggle">
                  <input
                    id="email-notifications-toggle"
                    type="checkbox"
                    className="sr-only peer"
                    aria-labelledby="email-notifications-label"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A2540]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 id="push-notifications-label" className="font-semibold text-sm text-[#0A2540]">Push Notifications</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Show desktop notifications for urgent alerts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="push-notifications-toggle">
                  <input
                    id="push-notifications-toggle"
                    type="checkbox"
                    className="sr-only peer"
                    aria-labelledby="push-notifications-label"
                    checked={settings.pushNotifications}
                    onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A2540]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 id="weekly-reports-label" className="font-semibold text-sm text-[#0A2540]">Weekly Reports</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Receive a summary of platform activity every Monday.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="weekly-reports-toggle">
                  <input
                    id="weekly-reports-toggle"
                    type="checkbox"
                    className="sr-only peer"
                    aria-labelledby="weekly-reports-label"
                    checked={settings.weeklyReports}
                    onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A2540]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#F5A623]" />
              <h3 className="font-bold text-[#0A2540]">Security</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 id="two-factor-auth-label" className="font-semibold text-sm text-[#0A2540]">Two-Factor Auth</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="two-factor-auth-toggle">
                  <input 
                    id="two-factor-auth-toggle"
                    type="checkbox" 
                    className="sr-only peer" 
                    aria-labelledby="two-factor-auth-label"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A2540]"></div>
                </label>
              </div>
              <button className="w-full mt-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-[#0A2540] hover:bg-slate-50 transition-colors">
                Change Password
              </button>
              <button className="w-full py-2 border border-red-200 bg-red-50 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors mt-2">
                Revoke All Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={emailDialogOpen}
        onOpenChange={(open) => {
          if (!emailChangeLoading) setEmailDialogOpen(open);
        }}
      >
        <DialogContent className="bg-white border-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#0A2540]">Verify Email Change</DialogTitle>
            <DialogDescription>
              {emailChangeStep === 'password'
                ? `Confirm your password before changing the login email to ${settings.admin_email.trim()}.`
                : `Enter the code sent to ${maskedRegisteredEmail}.`}
            </DialogDescription>
          </DialogHeader>

          {emailChangeStep === 'password' ? (
            <div className="space-y-2">
              <label htmlFor="current-password" className="text-sm font-semibold text-[#0A2540]">
                Current Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmailChangeRequest();
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                  autoComplete="current-password"
                  disabled={emailChangeLoading}
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="email-change-code" className="text-sm font-semibold text-[#0A2540]">
                Verification Code
              </label>
              <div className="relative">
                <BadgeCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="email-change-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmailChangeVerify();
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-lg tracking-[0.3em] focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  disabled={emailChangeLoading}
                  autoFocus
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              onClick={() => setEmailDialogOpen(false)}
              disabled={emailChangeLoading}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={emailChangeStep === 'password' ? handleEmailChangeRequest : handleEmailChangeVerify}
              disabled={emailChangeLoading}
              className="px-4 py-2 bg-[#0A2540] text-white rounded-lg text-sm font-semibold hover:bg-[#1a3f6f] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {emailChangeLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {emailChangeStep === 'password' ? 'Send Code' : 'Verify and Change'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
