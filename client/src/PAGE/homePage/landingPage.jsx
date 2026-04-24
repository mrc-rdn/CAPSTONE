import React from "react";
import SuccessStories from './components/SuccessStories.jsx';
import About from "./components/About.jsx";
import ChatBotModal from "./components/ChatBotModal.jsx";
import { HeroSection } from "@/components/ui/hero-section-1.jsx";
import { PulseFitHero } from "@/components/ui/pulse-fit-hero.jsx";
import FeatureGrid from "@/components/ui/feature-grid.jsx";
import { School, CalendarDays, Users, TrendingUp, MessageSquare, BookOpen } from 'lucide-react';

export default function LandingPage() {
  const programs = [
    {
      image: "/images/program-course-1.jpg",
      category: "COMMUNITY",
      title: "Vocational Training",
    },
    {
      image: "/images/program-course-2.jpg",
      category: "SKILLS",
      title: "Livelihood Programs",
    },
    {
      image: "/images/program-course-3.jpg",
      category: "EDUCATION",
      title: "Digital Literacy",
    },
    {
      image: "/images/tesda.png",
      category: "PARTNERS",
      title: "PLRMO Support",
    },
  ];

  const features = [
    {
      id: "skill-dev",
      icon: School,
      title: "Skill Development",
      description: "Access quality training modules designed for practical skill acquisition in various industries.",
    },
    {
      id: "training-calendar",
      icon: CalendarDays,
      title: "Training Calendar",
      description: "Stay updated with upcoming workshops, sessions, and important events.",
    },
    {
      id: "community-learning",
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow trainees, share experiences, and learn collaboratively.",
    },
    {
      id: "progress-tracking",
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your learning journey with intuitive progress indicators for each module.",
    },
    {
      id: "chatbot-support",
      icon: MessageSquare,
      title: "Integrated Chatbot Support",
      description: "Assists users by answering inquiries, guiding system navigation, and providing basic technical support.",
    },
    {
      id: "learning-resources",
      icon: BookOpen,
      title: "Learning Resources",
      description: "Access a variety of learning materials including videos, PDFs, and interactive lessons.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ChatBotModal />

      <main>
        {/* Main Modern Hero with Integrated Floating Navbar */}
        <div id="home">
          <HeroSection 
            title="Empowering Lives Through Community Learning"
            subtitle="E-Kabuhayan LMS provides accessible, quality training for Barangay San Isidro residents to develop skills and improve livelihoods."
            primaryActionLabel="Inquire →"
            primaryActionHref="https://www.facebook.com/PLRMO"
            secondaryActionLabel="Learn More →"
            secondaryActionHref="#features"
          />
        </div>

        {/* PulseFitHero Carousel Section */}
        <div className="py-12">
            <PulseFitHero
                logo={null} 
                title="Our Featured Programs"
                subtitle="Explore our diverse range of training and community support initiatives designed to help you grow."
                programs={programs}
                className="min-h-0 py-20"
            />
        </div>

        {/* New Feature Grid Section */}
        <div id="features">
            <FeatureGrid
                features={features}
                sectionTitle={
                  <span>
                    What We Offer On <span className='text-[#FFB823]'>E-Kabuhayan</span>
                  </span>
                }
                sectionSubtitle="Our platform provides everything you need to develop skills, track progress, and achieve your goals."
            />
        </div>

        <SuccessStories />   
        <div id="about">
            <About />
        </div>
      </main>
    </div>
  );
}
