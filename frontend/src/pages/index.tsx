import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(!!token);
    setUserEmail(email || '');
  }, []);

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="gradient-bg rounded-2xl p-8 md:p-12 text-white text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
                Welcome to EduPlatform
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                🚀 Discover, Learn, and Grow with Our Comprehensive Course Platform
              </p>
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/courses"
                    className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200 shadow-lg"
                  >
                    📚 Browse Courses
                  </Link>
                  <Link 
                    href="/enrollments"
                    className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200"
                  >
                    🎓 My Enrollments
                  </Link>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-all duration-200 shadow-lg inline-block"
                >
                  🚀 Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Wide Course Selection</h3>
            <p className="text-gray-600 leading-relaxed">
              Choose from a variety of courses ranging from beginner to advanced levels across different subjects.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Enrollment</h3>
            <p className="text-gray-600 leading-relaxed">
              Simple and quick enrollment process. Start learning immediately after signing up for a course.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor your learning journey with our comprehensive enrollment tracking and progress system.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600 font-medium">Available Courses</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-600">1000+</div>
              <div className="text-gray-600 font-medium">Students Enrolled</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">3</div>
              <div className="text-gray-600 font-medium">Difficulty Levels</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600 font-medium">Platform Access</div>
            </div>
          </div>
        </div>

        {/* User Welcome Section */}
        {isLoggedIn && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">
                👋 Welcome back, {userEmail}!
              </h3>
              <p className="text-blue-700 mb-6 text-lg">
                Continue your learning journey or discover new courses to expand your skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/enrollments"
                  className="btn-primary"
                >
                  🎓 View My Enrollments
                </Link>
                <Link 
                  href="/courses"
                  className="btn-secondary"
                >
                  📚 Browse New Courses
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center border border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Learning? 🎯
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are already advancing their skills with our platform.
          </p>
          {isLoggedIn ? (
            <Link 
              href="/courses"
              className="btn-primary text-lg px-8 py-4"
            >
              🚀 Explore Courses
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/signup"
                className="btn-primary text-lg px-8 py-4"
              >
                🚀 Get Started
              </Link>
              <Link 
                href="/login"
                className="btn-secondary text-lg px-8 py-4"
              >
                🔑 Sign In
              </Link>
              <Link 
                href="/courses"
                className="btn-outline text-lg px-8 py-4"
              >
                👀 Browse Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}