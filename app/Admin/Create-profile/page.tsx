"use client";
import NavbarAdmin from "@/app/components/NavbarAdmin";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Icône check

const steps = [
  { id: 1, title: "Company Info" },
  { id: 2, title: "Location" },
  { id: 3, title: "History" },
  { id: 4, title: "Organization" },
  { id: 5, title: "Contact" },
];

export default function CreateCompanyProfile() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
        <NavbarAdmin/>
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-6 py-10">
      {/* Barre de progression */}
      <div className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center w-1/5">
              {/* Cercle des étapes */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  currentStep > step.id ? "bg-blue-500 border-blue-500" : currentStep === step.id ? "bg-white border-blue-500" : "bg-gray-300 border-gray-300"
                } relative`}
              >
                {currentStep > step.id ? (
                  <FaCheckCircle className="text-white text-lg" />
                ) : (
                  <span className="text-gray-800 font-bold">{step.id}</span>
                )}
              </div>
              <p className={`text-sm mt-2 ${currentStep >= step.id ? "text-blue-600 font-semibold" : "text-gray-500"}`}>
                {step.title}
              </p>
            </div>
          ))}

          {/* Barre de connexion entre les étapes */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-300">
            <div
              className="h-1 bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenu du formulaire */}
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        {currentStep === 1 && <StepOne />}
        {currentStep === 2 && <StepTwo />}
        {currentStep === 3 && <StepThree />}
        {currentStep === 4 && <StepFour />}
        {currentStep === 5 && <StepFive />}

        {/* Boutons de navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
              onClick={prevStep}
            >
              Previous
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={nextStep}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={() => alert("Form Submitted!")}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  </>);
}

// Composants pour chaque étape
function StepOne() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Information</h2>
      <input type="text" placeholder="Company Name" className="w-full p-2 border rounded-md" />
    </div>
  );
}

function StepTwo() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Location</h2>
      <input type="text" placeholder="Company Address" className="w-full p-2 border rounded-md" />
    </div>
  );
}

function StepThree() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">History</h2>
      <input type="number" placeholder="Year Founded" className="w-full p-2 border rounded-md" />
    </div>
  );
}

function StepFour() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Organization</h2>
      <input type="text" placeholder="Departments" className="w-full p-2 border rounded-md" />
    </div>
  );
}

function StepFive() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
      <input type="email" placeholder="Contact Email" className="w-full p-2 border rounded-md" />
    </div>
  );
}
