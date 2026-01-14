import React from 'react'

export default function FAQ() {
  return (
    <div>
         {/* FAQs Section */}
        <section id="faqs" className="py-24 bg-gray-100">
          <div className="max-w-[1000px] mx-auto px-9">
            
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-500 text-lg md:text-xl">
                Find answers to common questions about our platform and programs.
              </p>
            </div>

            {/* FAQs container */}
            <div className="space-y-4">
              
              {/* FAQs laman */}
              {[
                {
                  question: "How do I enroll in courses?",
                  answer:
                    'After creating an account, you can browse available courses on your dashboard and click "Enroll" to join. Some courses may require approval from trainers.'
                },
                {
                  question: "What is the typical course duration?",
                  answer:
                    "Course durations vary depending on the subject matter. Most skills training courses run from 2-8 weeks, with flexible schedules to accommodate trainees."
                },
                {
                  question: "Do I receive certification after completion?",
                  answer:
                    "Yes, upon successful completion of a course, you will receive a digital certificate from PLRMO that can be used for employment and business opportunities."
                },
                {
                  question: "How can I get technical support?",
                  answer:
                    "For technical issues or questions, you can contact our support team through the help desk in your dashboard or email us at support@ekabuhayan.example.com."
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    className="flex justify-between items-center w-full p-6 text-left focus:outline-none"
                    aria-expanded="false"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div className="px-6 pb-6 text-gray-500">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      
    </div>
  )
}