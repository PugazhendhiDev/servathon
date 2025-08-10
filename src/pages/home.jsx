import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from "react-router";
import { PlusCircle } from 'lucide-react';
import * as THREE from 'three';

// Helper function to create a DNA helix for the background
function createDNA(radius, height, turns, pointsPerTurn) {
  const group = new THREE.Group();
  const points1 = [];
  const points2 = [];
  const totalPoints = turns * pointsPerTurn;

  for (let i = 0; i <= totalPoints; i++) {
    const angle = (i / pointsPerTurn) * Math.PI * 2;
    const y = (i / totalPoints) * height - height / 2;

    points1.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
    points2.push(new THREE.Vector3(radius * Math.cos(angle + Math.PI), y, radius * Math.sin(angle + Math.PI)));
  }

  const curve1 = new THREE.CatmullRomCurve3(points1);
  const curve2 = new THREE.CatmullRomCurve3(points2);

  const geometry1 = new THREE.BufferGeometry().setFromPoints(curve1.getPoints(totalPoints * 2));
  const geometry2 = new THREE.BufferGeometry().setFromPoints(curve2.getPoints(totalPoints * 2));

  const material = new THREE.LineBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 });

  const strand1 = new THREE.Line(geometry1, material);
  const strand2 = new THREE.Line(geometry2, material);
  group.add(strand1, strand2);

  const rungMaterial = new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.5 });
  for (let i = 0; i < totalPoints; i += Math.floor(pointsPerTurn / 4)) {
    const rungPoints = [points1[i], points2[i]];
    const rungGeometry = new THREE.BufferGeometry().setFromPoints(rungPoints);
    const rung = new THREE.Line(rungGeometry, rungMaterial);
    group.add(rung);
  }

  return group;
}

// Component for the animated Three.js background
const AnimatedBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Guard against running in non-browser environments
    if (typeof window === 'undefined') return;

    const currentMount = mountRef.current;

    // Scene setup
    let scene, camera, renderer, objects = [];
    let mouseX = 0, mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    let animationFrameId;

    // Initialization
    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 50;

      renderer = new THREE.WebGLRenderer({ canvas: currentMount, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xff6600, 1, 300);
      pointLight.position.set(50, 50, 50);
      scene.add(pointLight);

      // Create DNA Helices
      for (let i = 0; i < 4; i++) {
        const dna = createDNA(
          Math.random() * 4 + 4, Math.random() * 40 + 25,
          Math.random() * 4 + 3, 32
        );
        dna.position.set((Math.random() - 0.5) * 150, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100);
        dna.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        dna.userData.rotationSpeed = { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 };
        scene.add(dna);
        objects.push(dna);
      }

      // Add cell-like spheres
      const cellMaterial = new THREE.MeshStandardMaterial({
        color: 0xfb923c, emissive: 0xf87171, wireframe: true,
        roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.3
      });
      for (let i = 0; i < 15; i++) {
        const geometry = new THREE.SphereGeometry(Math.random() * 2.5 + 1, 16, 16);
        const mesh = new THREE.Mesh(geometry, cellMaterial);
        mesh.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        mesh.userData.rotationSpeed = { x: (Math.random() - 0.5) * 0.005, y: (Math.random() - 0.5) * 0.005 };
        scene.add(mesh);
        objects.push(mesh);
      }
    };

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotationSpeed.x;
        obj.rotation.y += obj.userData.rotationSpeed.y;
      });
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    // Event handlers
    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX) / 200;
      mouseY = (event.clientY - windowHalfY) / 200;
    };
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Start everything
    init();
    animate();

    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      // You might want to dispose geometries and materials as well for full cleanup
    };
  }, []);

  return <canvas ref={mountRef} id="bg-canvas" />;
};

// Component for the countdown timer
const Countdown = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2025-08-18T23:59:59") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time) => String(time).padStart(2, '0');

  return (
    <div className="flex justify-center space-x-4 md:space-x-8 text-center my-12">
      {timeLeft.days !== undefined ? (
        <>
          <div><div className="text-4xl md:text-6xl font-bold">{formatTime(timeLeft.days)}</div><div className="text-sm md:text-base font-light text-gray-400">Days</div></div>
          <div><div className="text-4xl md:text-6xl font-bold">{formatTime(timeLeft.hours)}</div><div className="text-sm md:text-base font-light text-gray-400">Hours</div></div>
          <div><div className="text-4xl md:text-6xl font-bold">{formatTime(timeLeft.minutes)}</div><div className="text-sm md:text-base font-light text-gray-400">Minutes</div></div>
          <div><div className="text-4xl md:text-6xl font-bold">{formatTime(timeLeft.seconds)}</div><div className="text-sm md:text-base font-light text-gray-400">Seconds</div></div>
        </>
      ) : (
        <div className='text-2xl font-bold'>The submission deadline has passed!</div>
      )}
    </div>
  );
};

// Component for a single FAQ item
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card p-4 rounded-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="faq-question flex justify-between items-center w-full text-left text-xl font-semibold text-white p-2">
        <span>{question}</span>
        <span className={`text-red-400 text-2xl font-light transition-transform duration-300 ${isOpen ? 'transform rotate-45' : ''}`}><PlusCircle /></span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-400 p-2">
          {answer}
        </div>
      )}
    </div>
  );
};

// Main App Component
export default function Home() {
  const faqData = [
    { question: "Who can participate?", answer: "Anyone with a passion for technology and healthcare is welcome! This includes students, professionals, designers, developers, and medical experts." },
    { question: "Is there a participation fee?", answer: "No, Serveathon is completely free for all participants." },
    { question: "What is the team size?", answer: "You can participate duo or in teams of up to 4 members. You can form teams beforehand or find teammates during our team formation session." }
  ];

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToId) {
      const el = document.getElementById(location.state.scrollToId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <div className="text-gray-200">
        <AnimatedBackground />

        <main>
          {/* Hero Section */}
          <section id="hero" className="relative text-white py-20 md:py-32 overflow-hidden">
            <div className="relative z-10 container mx-auto px-6 text-center">
              <h1 className="hero-title text-4xl md:text-6xl font-extrabold mb-4 leading-tight">Serve-a-thon 2025: Health Tech</h1>
              <p className="text-xl md:text-2xl mb-8 font-light text-gray-300">Innovate for a Healthier Future.</p>
              <Countdown />
              <p className="text-lg text-gray-300 mb-8">Until Online Idea Submission Deadline</p>
              <Link to="/event-registration" href="#register" className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 shadow-xl hover:shadow-red-500/50">Register Your Team!</Link>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-20 relative">
            <div className="container mx-auto px-6">
              <h2 className="section-title">About Serveathon</h2>
              <p className="section-subtitle">
                Serve-a-thon is a hackathon focused on solving real-world health and social challenges. It brings together innovators to build impactful solutions that improve lives and support community well-being.              </p>
            </div>
          </section>

          {/* Themes Section */}
          <section id="themes" className="py-20 relative">
            <div className="container mx-auto px-6">
              <h2 className="section-title">Hackathon Theme</h2>
              <p className="section-subtitle">"Innovate to Serve – Tech Solutions for Health and Social Impact"</p>
              <div className="max-w-2xl mx-auto">
                <div className="glass-card p-8 transform hover:-translate-y-2 hover:shadow-red-500/20 flex flex-col md:flex-row items-center gap-8">
                  <div className="text-red-400 flex-shrink-0">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9.172 14.828a4 4 0 015.656 0"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-3 text-white">Healthcare & Wellness</h3>
                    <p className="text-gray-400">Serve-a-thon is a hackathon focused on creating real-world impact through tech. Build innovative, practical solutions that improve healthcare, support mental well-being, enhance safety, or uplift communities. Use your skills to build for a better tomorrow.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section id="schedule" className="py-20 relative">
            <div className="container mx-auto px-6">
              <h2 className="section-title">Event Schedule</h2>
              <p className="section-subtitle">A two-round event to find the most innovative health-tech solution.</p>
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute left-1/2 w-0.5 bg-red-500/30 h-full transform -translate-x-1/2"></div>

                  <div className="mb-8 flex flex-col md:flex-row justify-between items-center w-full">
                    <div className="order-1 w-full md:w-5/12"></div>

                    <div className="z-20 flex items-center order-1 bg-red-500 shadow-xl w-12 h-12 rounded-full my-4 md:my-0">
                      <h1 className="mx-auto font-semibold text-lg text-white">1</h1>
                    </div>

                    {/* Round 1 */}
                    <div className="order-1 glass-card w-full md:w-5/12 px-6 py-4">
                      <p className="text-gray-400 text-sm">August 18, 2025</p>
                      <h3 className="font-bold text-white text-xl">Round 1: Online PPT Submission</h3>
                      <p className="text-sm leading-snug tracking-wide text-gray-400">
                        Submit your PowerPoint presentation online, explaining your selected problem statement and solution idea.
                        Submissions will be evaluated based on relevance, innovation, and feasibility.
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 flex flex-col md:flex-row-reverse justify-between items-center w-full">
                    <div className="order-1 w-full md:w-5/12"></div>

                    <div className="z-20 flex items-center order-1 bg-red-500 shadow-xl w-12 h-12 rounded-full my-4 md:my-0">
                      <h1 className="mx-auto text-white font-semibold text-lg">2</h1>
                    </div>

                    {/* Round 2 */}
                    <div className="order-1 glass-card w-full md:w-5/12 px-6 py-4">
                      <p className="text-gray-400 text-sm">August 22, 2025</p>
                      <h3 className="font-bold text-white text-xl">Round 2: Offline Finale</h3>
                      <p className="text-sm leading-snug tracking-wide text-gray-400">
                        Top 25 shortlisted teams will be invited to present their problem statement and prototype at RIT Campus.
                        Get ready to pitch your ideas and bring your vision to life before expert judges!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Prizes Section */}
          <section id="prizes" className="py-20 relative">
            <div className="container mx-auto px-6">
              <h2 className="section-title">Prizes & Recognition</h2>
              <p className="section-subtitle">All registered participants will be awarded a digital certificate of participation.</p>
              <h2 className="text-white text-center text-3xl md:text-4xl md:px-20">The top three teams will receive certificates of excellence along with exciting prizes in recognition of their innovative solutions and impactful ideas.</h2>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq" className="py-20 relative">
            <div className="container mx-auto px-6">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto mt-8 space-y-4">
                {faqData.map((faq, index) => (
                  <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
