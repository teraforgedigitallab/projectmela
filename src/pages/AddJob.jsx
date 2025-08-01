import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { 
  FaUserTie, 
  FaBuilding, 
  FaFileAlt,
  FaMoneyBillWave,
  FaEnvelope,
  FaMobile,
  FaTasks,
  FaCheck,
  FaList,
  FaPlus,
  FaWhatsapp,
  FaThumbtack,
  FaBullhorn
} from 'react-icons/fa';

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
    <div className="bg-gray-50">
      {/* Main content */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
          {/* Form header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Post a Project</h1>
            <p className="text-gray-600 mt-1">Find the best talent for your project and get your project done hassle free.</p>
          </div>

          {/* Project form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Section 1: About You */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-2">
                  1
                </div>
                <h2 className="text-xl font-semibold text-gray-800">About You</h2>
              </div>
              
              <div className="pl-10">
                <div className="mb-4">
                  <label htmlFor="name" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaUserTie className="mr-2 text-primary" />
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaEnvelope className="mr-2 text-primary" />
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaMobile className="mr-2 text-primary" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput
                    country="in"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputStyle={{ width: '100%', height: '42px' }}
                    buttonStyle={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem' }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                    }}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaWhatsapp className="mr-2 text-primary" />
                    Preferred Communication Method <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex space-x-6">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="communicationPreference"
                        value="whatsapp"
                        checked={communicationPreference === 'whatsapp'}
                        onChange={(e) => setCommunicationPreference(e.target.value)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Whatsapp</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="communicationPreference"
                        value="email"
                        checked={communicationPreference === 'email'}
                        onChange={(e) => setCommunicationPreference(e.target.value)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Email</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="communicationPreference"
                        value="both"
                        checked={communicationPreference === 'both'}
                        onChange={(e) => setCommunicationPreference(e.target.value)}
                        className="form-radio h-4 w-4 text-primary"
                      />
                      <span className="ml-2">Both</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: About the Project */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-2">
                  2
                </div>
                <h2 className="text-xl font-semibold text-gray-800">About the Project</h2>
              </div>
              
              <div className="pl-10">
                <div className="mb-4">
                  <label htmlFor="projectTitle" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaFileAlt className="mr-2 text-primary" />
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="projectTitle"
                    name="projectTitle"
                    type="text"
                    placeholder="Enter Project Title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="projectType" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaBuilding className="mr-2 text-primary" />
                    Project Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled selected>Choose a project type</option>
                    {projectRoleTypeData.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaFileAlt className="mr-2 text-primary" />
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="requirements" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaList className="mr-2 text-primary" />
                    Project Requirements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.requirements}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="responsibilities" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaTasks className="mr-2 text-primary" />
                    Key Responsibilities <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="responsibilities"
                    name="responsibilities"
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label htmlFor="projectFile" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaFileAlt className="mr-2 text-primary" />
                    Other Project Related Documents <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="projectFile"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                  {fileError && (
                    <p className="text-red-500 text-xs mt-1">{fileError}</p>
                  )}
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

                <div className="mb-4">
                  <label className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaCheck className="mr-2 text-primary" />
                    Skills Required <span className="text-red-500">*</span>
                  </label>
                  <SkillsSelector
                    selectedSkills={selectedTechStack}
                    setSelectedSkills={setSelectedTechStack}
                    options={skillOptions}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="budget" className="flex items-center text-gray-700 text-sm font-medium mb-2">
                    <FaMoneyBillWave className="mr-2 text-primary" />
                    Project Budget (in Rs)
                  </label>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    disabled={noFixedBudget}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    This information will NOT be disclosed with any developer and is for our reference only.
                  </p>
                  <label className="inline-flex items-center mt-3">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-primary"
                      checked={noFixedBudget}
                      onChange={(e) => {
                        setNoFixedBudget(e.target.checked);
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, budget: '' }));
                        }
                      }}
                    />
                    <span className="ml-2 text-gray-700">No fixed Budget</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 3: Paid Add-ons */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-2">
                  3
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Select paid add-ons</h2>
              </div>
              
              <div className="pl-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex items-center p-4 border rounded-lg transition-colors ${
                      stick ? 'bg-primary-50 border-primary' : 'bg-white border-gray-300'
                    }`}
                    onClick={() => setStick(!stick)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaThumbtack className="mr-2 text-primary" />
                        <span className="font-medium">Stick your post to stay on top</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">2x more views</p>
                      <p className="font-medium mt-1">
                        <span className="line-through text-gray-500">+₹75</span>{' '}
                        <span className="text-green-600">FREE</span>
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      stick ? 'bg-primary text-white' : 'border border-gray-300'
                    }`}>
                      {stick ? <FaCheck className="text-sm" /> : <FaPlus className="text-sm text-gray-500" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`flex items-center p-4 border rounded-lg transition-colors ${
                      highlight ? 'bg-primary-50 border-primary' : 'bg-white border-gray-300'
                    }`}
                    onClick={() => setHighlight(!highlight)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaBullhorn className="mr-2 text-primary" />
                        <span className="font-medium">Notify Users about the Project Listing</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">4x more views</p>
                      <p className="font-medium mt-1">
                        <span className="line-through text-gray-500">+₹125</span>{' '}
                        <span className="text-green-600">FREE</span>
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      highlight ? 'bg-primary text-white' : 'border border-gray-300'
                    }`}>
                      {highlight ? <FaCheck className="text-sm" /> : <FaPlus className="text-sm text-gray-500" />}
                    </div>
                  </button>
                </div>

                <div className="mt-8">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-primary rounded"
                      checked={agreedToTerms}
                      onChange={() => setAgreedToTerms(!agreedToTerms)}
                      required
                    />
                    <span className="ml-2 text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary hover:underline">Terms and Conditions</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full md:w-auto"
                  >
                    {isLoading ? 'Posting...' : 'Post Project'}
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  By signing into the platform you agree to our{' '}
                  <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Modal */}
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

      {/* Cookie consent banner */}
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
    </div>
  );
};

export default AddJob;