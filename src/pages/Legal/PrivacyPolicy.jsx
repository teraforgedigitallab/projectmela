import React, { useEffect } from "react";
import SectionHeader from "../../components/Legal/SectionHeader";
import InfoContainer from "../../components/Legal/InfoContainer";
import { privacyPolicyData } from "../../data/legalData";

const PrivacyPolicy = () => {
    const { companyName, text } = privacyPolicyData.intro;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-sm shadow-md animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">
                Privacy Policy
            </h1>

            <p className="mb-8 text-lg text-gray-700">
                At <b>{companyName}</b>, {text}
            </p>

            {privacyPolicyData.sections.map((section) => (
                <div
                    key={section.number}
                    className="mb-8 pb-6 border-b border-gray-200 last:border-b-0"
                >
                    <SectionHeader
                        number={section.number}
                        title={section.title}
                    />
                    <p className="mt-2 mb-4 text-gray-700">
                        {section.introText}
                    </p>

                    {section.infoContainers.map((container) => (
                        <InfoContainer
                            key={container.heading}
                            heading={container.heading}
                            details={container.details}
                            isListType={container.isListType ?? true}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PrivacyPolicy;