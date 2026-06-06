import { motion } from 'motion/react';
import { ArrowLeft, GraduationCap, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { applications as appsApi } from '../lib/api';

export function StudentEnrollment() {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    currentClass: '',
    stream: '',
    previousSchool: '',
    targetExam: [] as string[],
    preferredCenter: '',
    hearAbout: '',
    address: '',
    city: '',
    pincode: '',
    photoId: null as File | null
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const examOptions = [
    'JEE Main',
    'JEE Advanced',
    'NEET',
    'CBSE Board',
    'State Board',
    'KVPY',
    'Olympiads',
    'Foundation Course'
  ];

  const handleExamToggle = (exam: string) => {
    setFormData(prev => ({
      ...prev,
      targetExam: prev.targetExam.includes(exam)
        ? prev.targetExam.filter(e => e !== exam)
        : [...prev.targetExam, exam]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await appsApi.create({
        name: formData.studentName,
        email: formData.email,
        phone: formData.phone,
        type: 'student',
        role_or_class: formData.currentClass || 'Student Applicant',
        notes: [
          formData.parentName && `Parent/Guardian: ${formData.parentName}`,
          formData.stream && `Stream/Board: ${formData.stream}`,
          formData.previousSchool && `School: ${formData.previousSchool}`,
          formData.targetExam.length && `Target: ${formData.targetExam.join(', ')}`,
          formData.preferredCenter && `Center: ${formData.preferredCenter}`,
          formData.alternatePhone && `Alternate phone: ${formData.alternatePhone}`,
          formData.address && `Address: ${formData.address}, ${formData.city} - ${formData.pincode}`,
          formData.hearAbout && `Source: ${formData.hearAbout}`,
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

            <h2 className="text-3xl font-bold text-primary mb-4">Enrollment Successful!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for choosing ARYAVARTA! Your enrollment application has been submitted successfully. Our admissions team will contact you within 24 hours to schedule a demo class.
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
            <span className="font-medium">Start Your Journey</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            Student Enrollment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful students. Get expert coaching in a trusted school environment.
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
            <div className="text-3xl font-bold text-accent mb-2">₹25K</div>
            <div className="text-sm text-muted-foreground">Annual Fee (All Subjects)</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-accent mb-2">School</div>
            <div className="text-sm text-muted-foreground">Safe Campus Environment</div>
          </div>
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-3xl font-bold text-accent mb-2">Expert</div>
            <div className="text-sm text-muted-foreground">Qualified Faculty</div>
          </div>
        </motion.div>

        {/* Enrollment Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Class *
                  </label>
                  <select
                    required
                    value={formData.currentClass}
                    onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Class</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="12-pass">12th Passed (Dropper)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Stream/Board *
                  </label>
                  <select
                    required
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="">Select Stream</option>
                    <option value="science">Science (PCM)</option>
                    <option value="science-bio">Science (PCB)</option>
                    <option value="commerce">Commerce</option>
                    <option value="arts">Arts/Humanities</option>
                    <option value="cbse">CBSE</option>
                    <option value="icse">ICSE</option>
                    <option value="state">State Board</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Previous/Current School
                  </label>
                  <input
                    type="text"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter School Name"
                  />
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Parent/Guardian Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Parent/Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Parent/Guardian Name"
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
                    placeholder="parent@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Your Primary Phone Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Your Alternate Phone Number"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Address Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Address *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    rows={3}
                    placeholder="House No., Street, Locality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Enter Pincode"
                  />
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Target Exam/Course *</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {examOptions.map((exam) => (
                  <label
                    key={exam}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.targetExam.includes(exam)
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-accent/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetExam.includes(exam)}
                      onChange={() => handleExamToggle(exam)}
                      className="w-5 h-5 text-accent focus:ring-accent rounded"
                    />
                    <span className="text-sm font-medium text-foreground">{exam}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Center Selection */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Preferred Center *</h3>
              <select
                required
                value={formData.preferredCenter}
                onChange={(e) => setFormData({ ...formData, preferredCenter: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select Nearest Center</option>
                <option value="dps-indiranagar">DPS Indiranagar</option>
                <option value="ryan-hsr">Ryan International - HSR Layout</option>
                <option value="silver-whitefield">Silver Oaks - Whitefield</option>
                <option value="national-koramangala">National Academy - Koramangala</option>
                <option value="delhi-dwarka">Delhi Public School - Dwarka</option>
                <option value="mumbai-andheri">Mumbai International - Andheri</option>
              </select>
            </div>

            {/* How did you hear */}
            <div className="pt-6 border-t border-border">
              <label className="block text-sm font-medium text-foreground mb-2">
                How did you hear about us?
              </label>
              <select
                value={formData.hearAbout}
                onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select an option</option>
                <option value="school">Through School</option>
                <option value="friend">Friend/Family Reference</option>
                <option value="social">Social Media</option>
                <option value="search">Google Search</option>
                <option value="advertisement">Advertisement</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Document Upload */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-xl font-bold text-primary mb-4">Student Photo/ID</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-accent transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-accent font-semibold hover:underline">
                    Click to upload
                  </span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, photoId: e.target.files?.[0] || null })}
                  />
                </label>
                <p className="text-sm text-muted-foreground mt-2">JPG, PNG, PDF (max. 2MB)</p>
                {formData.photoId && (
                  <p className="text-sm text-accent mt-2">✓ {formData.photoId.name}</p>
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
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Enrollment'}
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
