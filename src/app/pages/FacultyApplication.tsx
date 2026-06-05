import { motion } from 'motion/react';
import { ArrowLeft, GraduationCap, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { applications as appsApi } from '../lib/api';

export function FacultyApplication() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    subjects: [] as string[],
    preferredLocation: '',
    currentEmployment: '',
    linkedin: '',
    resume: null as File | null
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const subjectOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'Computer Science',
    'Economics',
    'Accountancy',
    'Business Studies'
  ];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const { error } = await appsApi.create({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        type: 'faculty',
        role_or_class: formData.subjects.length ? formData.subjects.join(', ') : 'Faculty Applicant',
        notes: [
          formData.qualification && `Qualification: ${formData.qualification}`,
          formData.experience && `Experience: ${formData.experience} years`,
          formData.preferredLocation && `Location: ${formData.preferredLocation}`,
          formData.currentEmployment && `Employment: ${formData.currentEmployment}`,
          formData.linkedin && `LinkedIn: ${formData.linkedin}`,
        ].filter(Boolean).join(' | '),
      });
      if (error) throw new Error(error);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
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

            <h2 className="text-3xl font-bold text-primary mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for applying to join ARYAVARTA as a faculty member. Our team will review your application and contact you within 3-5 business days.
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full mb-6">
            <GraduationCap className="w-4 h-4" />
            <span className="font-medium">Join Our Faculty Team</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            Faculty Application
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Be part of India's fastest-growing coaching network. Shape the future of thousands of students.
          </p>
        </motion.div>

        {/* Benefits Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-accent mb-2">₹40-80K</div>
            <div className="text-sm text-muted-foreground">Monthly Salary</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-accent mb-2">20+</div>
            <div className="text-sm text-muted-foreground">Centers Pan-India</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-accent mb-2">Growth</div>
            <div className="text-sm text-muted-foreground">Career Advancement</div>
          </div>
        </motion.div>

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Your Full Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Example@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Your Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Professional Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="qualification" className="block text-sm font-medium text-foreground mb-2">
                    Highest Qualification *
                  </label>
                  <select
                    id="qualification"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Qualification</option>
                    <option value="phd">Ph.D.</option>
                    <option value="msc">M.Sc.</option>
                    <option value="mtech">M.Tech.</option>
                    <option value="ma">M.A.</option>
                    <option value="bsc">B.Sc.</option>
                    <option value="btech">B.Tech.</option>
                    <option value="ba">B.A.</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
                    Years of Teaching Experience *
                  </label>
                  <select
                    id="experience"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="currentEmployment" className="block text-sm font-medium text-foreground mb-2">
                    Current Employment Status *
                  </label>
                  <select
                    id="currentEmployment"
                    required
                    value={formData.currentEmployment}
                    onChange={(e) => setFormData({ ...formData, currentEmployment: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Status</option>
                    <option value="employed">Currently Employed</option>
                    <option value="unemployed">Currently Unemployed</option>
                    <option value="freelance">Freelance/Part-time</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredLocation" className="block text-sm font-medium text-foreground mb-2">
                    Preferred Location *
                  </label>
                  <select
                    id="preferredLocation"
                    required
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Location</option>
                    <option value="bangalore">Uttar Pradesh</option>
                    <option value="delhi">Prayagraj</option>
                    <option value="mumbai">Lucknow</option>
                    <option value="pune">Gorakhpur</option>
                    <option value="hyderabad">Vanarshi</option>
                    <option value="chennai">Kanpur</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Subjects You Can Teach *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjectOptions.map((subject) => (
                  <label
                    key={subject}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${formData.subjects.includes(subject)
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-accent/50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                      className="w-5 h-5 text-accent focus:ring-accent rounded"
                    />
                    <span className="text-sm font-medium text-foreground">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Resume/CV *</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-accent font-semibold hover:underline">
                    Click to upload
                  </span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">PDF, DOC, DOCX (max. 5MB)</p>
                {formData.resume && (
                  <p className="text-sm text-accent mt-2">✓ {formData.resume.name}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              {submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Submit Application
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Application'}
              </button>
              <p className="text-sm text-muted-foreground text-center mt-4">
                By submitting, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}