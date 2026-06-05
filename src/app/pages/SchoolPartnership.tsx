import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Building2, CheckCircle2, Loader2, School, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { applications as appsApi } from '../lib/api';

export function SchoolPartnership() {
  const [formData, setFormData] = useState({
    schoolName: '',
    contactName: '',
    designation: '',
    email: '',
    phone: '',
    website: '',
    board: '',
    studentStrength: '',
    availableClassrooms: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    preferredStart: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await appsApi.create({
        name: formData.schoolName,
        email: formData.email,
        phone: formData.phone,
        type: 'school',
        role_or_class: formData.board || 'School Partnership',
        notes: [
          `Contact: ${formData.contactName}`,
          `Designation: ${formData.designation}`,
          `Location: ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          formData.studentStrength && `Student strength: ${formData.studentStrength}`,
          formData.availableClassrooms && `Available classrooms: ${formData.availableClassrooms}`,
          formData.website && `Website: ${formData.website}`,
          formData.preferredStart && `Preferred start: ${formData.preferredStart}`,
          formData.message && `Message: ${formData.message}`,
        ].filter(Boolean).join(' | '),
      });

      if (error) throw new Error(error);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-accent">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-primary mb-4">Partnership Request Submitted!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your interest in partnering with ARYAVARTA. Our partnership team will contact you within 2-3 business days.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full mb-6">
            <School className="w-4 h-4" />
            <span className="font-medium">Partner With ARYAVARTA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">School Partnership Form</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Turn unused classrooms into a high-quality coaching center with zero infrastructure investment.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { value: 'Zero', label: 'Capital Investment', icon: Building2 },
            { value: '40%', label: 'Revenue Share', icon: TrendingUp },
            { value: 'Full', label: 'Operational Support', icon: School },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <Icon className="w-6 h-6 text-accent mb-3" />
              <div className="text-3xl font-bold text-accent mb-2">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">School Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="School Name *">
                  <input required value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className={inputClass} placeholder="Enter school name" />
                </Field>
                <Field label="Education Board *">
                  <select required value={formData.board} onChange={(e) => setFormData({ ...formData, board: e.target.value })} className={inputClass}>
                    <option value="">Select board</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                    <option value="International Board">International Board</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>
                <Field label="Total Student Strength *">
                  <input required type="number" min="1" value={formData.studentStrength} onChange={(e) => setFormData({ ...formData, studentStrength: e.target.value })} className={inputClass} placeholder="Number of students" />
                </Field>
                <Field label="Available Classrooms *">
                  <input required type="number" min="1" value={formData.availableClassrooms} onChange={(e) => setFormData({ ...formData, availableClassrooms: e.target.value })} className={inputClass} placeholder="Available after-school rooms" />
                </Field>
                <Field label="School Website">
                  <input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className={inputClass} placeholder="https://school.example" />
                </Field>
                <Field label="Preferred Partnership Start">
                  <input type="month" value={formData.preferredStart} onChange={(e) => setFormData({ ...formData, preferredStart: e.target.value })} className={inputClass} />
                </Field>
              </div>
            </section>

            <section className="pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-primary mb-4">Authorized Contact</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Contact Person *">
                  <input required value={formData.contactName} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} className={inputClass} placeholder="Full name" />
                </Field>
                <Field label="Designation *">
                  <input required value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className={inputClass} placeholder="Principal, Director, Trustee" />
                </Field>
                <Field label="Email Address *">
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="contact@school.edu" />
                </Field>
                <Field label="Phone Number *">
                  <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="Enter phone number" />
                </Field>
              </div>
            </section>

            <section className="pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-primary mb-4">School Address</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Field label="Full Address *">
                    <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass} placeholder="Street and locality" />
                  </Field>
                </div>
                <Field label="City *">
                  <input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass} placeholder="City" />
                </Field>
                <Field label="State *">
                  <input required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputClass} placeholder="State" />
                </Field>
                <Field label="Pincode *">
                  <input required inputMode="numeric" value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} className={inputClass} placeholder="6-digit pincode" />
                </Field>
              </div>
            </section>

            <section className="pt-6 border-t border-border">
              <Field label="Additional Information">
                <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={inputClass} placeholder="Tell us about your school, available facilities, or partnership goals" />
              </Field>
            </section>

            {submitError && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{submitError}</div>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <School className="w-5 h-5" />}
              {submitting ? 'Submitting...' : 'Submit Partnership Request'}
            </button>
            <p className="text-sm text-muted-foreground text-center">Our team will use these details only to evaluate and discuss the partnership.</p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
