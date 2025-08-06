import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ProfileBanner from '../components/Profile/ProfileBanner';

// Custom hooks
import useCheckUserSignin from '../hooks/useCheckUserSignin';
import useCookieConsent from '../hooks/useCookieConsent';

// Components
import { Modal } from '../ui';
import { SkillsSelector } from '../components';

// Data
import { skillOptions, projectRoleTypeData } from '../data/data';

// Utilities
import { generateUniqueId, countDigits } from '../utils/function';
import { uploadFile } from '../utils/uploadFile';

const AddJob = () => {
  const navigate = useNavigate();
  useCheckUserSignin(navigate); // Enable authentication check
  const { isCookiesAccepted, handleAcceptCookies } = useCookieConsent();

  // State variables
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [noFixedBudget, setNoFixedBudget] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalHeading, setModalHeading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [phoneError, setPhoneError] = useState('');
  const [communicationPreference, setCommunicationPreference] = useState('both');
  const [stick, setStick] = useState(false);
  const [highlight, setHighlight] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectTitle: '',
    projectType: '',
    description: '',
    requirements: '',
    responsibilities: '',
    budget: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle phone input
  const handlePhoneChange = (value, country) => {
    const formattedPhone = `+${country.dialCode}-${value.slice(country.dialCode.length)}`;
    const digitsCount = countDigits(value.slice(country.dialCode.length));

    if (digitsCount < 10) {
      setPhoneError('Invalid Phone Number');
    } else {
      setPhoneError('');
    }

    setFormData(prev => ({ ...prev, phone: formattedPhone }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError('File size should not exceed 5MB');
        setFile(null);
      } else {
        setFileError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(null);
    const fileInput = document.getElementById('projectFile');
    if (fileInput) fileInput.value = '';
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneError) {
      toast.error('Please provide a valid phone number');
      return;
    }

    setIsLoading(true);

    // Generate document ID
    const truncatedTitle = formData.projectTitle.slice(0, 25).trim().replace(/\s/g, "-");
    const uniqueId = generateUniqueId();
    const docId = `${truncatedTitle}---${uniqueId}`;

    // Upload file if provided
    let fileUrl = '';
    if (file) {
      try {
        fileUrl = await uploadFile(file, `project-documents/${uniqueId}-${file.name}`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    if (!agreedToTerms) {
      toast.info('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    // Create project data object
    const projectData = {
      ...formData,
      techStack: selectedTechStack,
      budget: noFixedBudget ? -1 : formData.budget,
      isStickPostonTop: stick,
      isNotifyPostonEmail: highlight,
      createdAt: new Date(),
      fileUrl,
      communicationPreference,
      isDeletedByAdmin: false,
      points: 0,
      minXP: 0,
      status: 'Unverified',
      selectedApplicants: [],
      removedApplicants: [],
      moderators: [],
    };

    try {
      await setDoc(doc(db, "Projects", docId), projectData);

      // Send email notification
      try {
        const emailParams = {
          name: formData.name,
          projectTitle: formData.projectTitle,
          email: formData.email,
          mobile: formData.phone,
          projectType: formData.projectType,
          description: formData.description,
          requirements: formData.requirements,
          responsibilities: formData.responsibilities,
          techStack: selectedTechStack.join(', '),
          budget: noFixedBudget ? 'No Fixed Budget' : `₹${formData.budget}`,
          fileUrl: fileUrl || 'No file attached',
          communicationPreference: communicationPreference.charAt(0).toUpperCase() + communicationPreference.slice(1)
        };

        await emailjs.send(
          'service_lfyf7ng',
          'template_i1zmdpu',
          emailParams,
          '1wo_JqwMQf6ENw8GE'
        );
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      setModalHeading("Project Submitted Successfully");
      setModalMessage("Your project requirement has been submitted and will be reviewed by our team. You will soon be contacted by someone from our team.");
      setShowModal(true);
    } catch (error) {
      console.error("Error posting project:", error);
      toast.error("Failed to post project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <ProfileBanner
        title="Job Details"
        subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: "Post a Project", href: "/post-project" }
        ]}
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-sm shadow-md p-8">
          <h1 className="text-2xl font-semibold text-black mb-6">Post a Project</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name, Email, Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name<span className="text-red-500">*</span></label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                <input
                  name="email"
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                <PhoneInput
                  country="in"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{ width: '100%', height: '48px', borderRadius: '0.5rem', borderColor: '#E5E7EB' }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: false,
                  }}
                />
                {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
              </div>
            </div>

            {/* Communication Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Communication</label>
              <div className="flex gap-4 mt-2">
                {["whatsapp", "email", "both"].map((option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="communicationPreference"
                      value={option}
                      checked={communicationPreference === option}
                      onChange={(e) => setCommunicationPreference(e.target.value)}
                      className="form-radio h-4 w-4 text-primary"
                    />
                    <span className="ml-2 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Project Title & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title<span className="text-red-500">*</span></label>
                <input
                  name="projectTitle"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.projectTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Type<span className="text-red-500">*</span></label>
                <select
                  name="projectType"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choose a project type</option>
                  {projectRoleTypeData.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description, Requirements, Responsibilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Description<span className="text-red-500">*</span></label>
              <textarea
                name="description"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Requirements<span className="text-red-500">*</span></label>
              <textarea
                name="requirements"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.requirements}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities<span className="text-red-500">*</span></label>
              <textarea
                name="responsibilities"
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.responsibilities}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Skills Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required<span className="text-red-500">*</span></label>
              <SkillsSelector
                selectedSkills={selectedTechStack}
                setSelectedSkills={setSelectedTechStack}
                options={skillOptions}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Document (optional)</label>
              <input
                id="projectFile"
                type="file"
                onChange={handleFileChange}
                className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
              />
              {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
              {file && (
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">Selected: {file.name}</span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (in Rs)</label>
              <input
                name="budget"
                type="number"
                disabled={noFixedBudget}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.budget}
                onChange={handleChange}
              />
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  checked={noFixedBudget}
                  onChange={(e) => {
                    setNoFixedBudget(e.target.checked);
                    if (e.target.checked) setFormData(prev => ({ ...prev, budget: '' }));
                  }}
                />
                <span className="ml-2 text-gray-700 text-sm">No fixed Budget</span>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                This information will NOT be disclosed with any developer and is for our reference only.
              </p>
            </div>

            {/* Paid Add-ons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stick Post Add-on */}
              <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50 p-4 shadow-sm">
                <input
                  type="checkbox"
                  checked={stick}
                  onChange={() => setStick(!stick)}
                  className="form-checkbox h-5 w-5 text-primary accent-primary"
                  id="stick-addon"
                />
                <label htmlFor="stick-addon" className="ml-3 flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">Stick your post to stay on top</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">2x more views</div>
                  <div className="font-medium mt-1">
                    <span className="line-through text-gray-500">+₹75</span>
                    <span className="text-green-600 ml-2">FREE</span>
                  </div>
                </label>
              </div>
              {/* Highlight Post Add-on */}
              <div className="flex items-center border border-gray-400 rounded-sm bg-gray-50 p-4 shadow-sm">
                <input
                  type="checkbox"
                  checked={highlight}
                  onChange={() => setHighlight(!highlight)}
                  className="form-checkbox h-5 w-5 text-primary accent-primary"
                  id="highlight-addon"
                />
                <label htmlFor="highlight-addon" className="ml-3 flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">Notify users about the project</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">4x more views</div>
                  <div className="font-medium mt-1">
                    <span className="line-through text-gray-500">+₹125</span>
                    <span className="text-green-600 ml-2">FREE</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Terms and Submit */}
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-primary rounded"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  required
                />
                <span className="ml-2 text-gray-700 text-sm">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-6 py-3 rounded font-semibold hover:bg-primary-hover transition-all duration-300 ease-in-out w-auto"
              >
                {isLoading ? 'Posting...' : 'Post Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          navigate('/');
        }}
        heading={modalHeading}
        body={modalMessage}
        primaryButtonText="OK"
        showButtons={false}
      />
      {!isCookiesAccepted && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-50">
          <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          <div className="flex space-x-2">
            <button
              onClick={handleAcceptCookies}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
            >
              Accept
            </button>
            <button
              onClick={() => navigate('/privacy')}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Learn More
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AddJob;