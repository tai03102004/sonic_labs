import Layout from '@/components/Layout';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  updatedAt: string;
}

interface Enrollment {
  id: number;
  studentEmail: string;
  courseId: string;
  enrolledAt: string;
  Course: Course;
}

interface EnrollmentsResponse {
  studentEmail: string;
  totalEnrollments: number;
  enrollments: Enrollment[];
}

const API_BASE_URL = 'http://localhost:8080/api';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserAndEnrollments();
  }, []);

  const fetchUserAndEnrollments = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage?.getItem('token');
      const email = localStorage?.getItem('email');
      
      if (!token || !email) {
        setError('Please login to view your enrollments');
        setLoading(false);
        return;
      }
      console.log(email);
      // Then fetch enrollments
      const enrollmentsResponse = await fetch(
        `${API_BASE_URL}/enrollments/students?email=${encodeURIComponent(email)}`
      );

      if (!enrollmentsResponse.ok) {
        throw new Error('Failed to fetch enrollments');
      }

      const data: EnrollmentsResponse = await enrollmentsResponse.json();
      console.log("DATA", data);
      setEnrollments(data.enrollments);
      setTotalEnrollments(data.totalEnrollments);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': 
        return 'bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-full';
      case 'Intermediate': 
        return 'bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium rounded-full';
      case 'Advanced': 
        return 'bg-red-100 text-red-800 px-3 py-1 text-sm font-medium rounded-full';
      default: 
        return 'bg-gray-100 text-gray-800 px-3 py-1 text-sm font-medium rounded-full';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '🌱';
      case 'Intermediate': return '🌿';
      case 'Advanced': return '🌳';
      default: return '📖';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="text-lg text-gray-600">Loading your enrollments...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Error</div>
            <div className="text-red-700">{error}</div>
            <button 
              onClick={fetchUserAndEnrollments}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Learning Journey</h1>
          <p className="text-gray-600 text-lg">
            {userEmail && (
              <>
                Welcome <span className="font-semibold text-blue-600">{userEmail}</span>! 
                You are enrolled in <span className="font-semibold text-blue-600">{totalEnrollments}</span> course{totalEnrollments !== 1 ? 's' : ''}
              </>
            )}
          </p>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalEnrollments}</div>
              <div className="text-sm text-blue-700 font-medium">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {enrollments.filter(e => e.Course.difficulty === 'Beginner').length}
              </div>
              <div className="text-sm text-green-700 font-medium">🌱 Beginner Level</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {enrollments.filter(e => e.Course.difficulty === 'Advanced').length}
              </div>
              <div className="text-sm text-red-700 font-medium">🌳 Advanced Level</div>
            </div>
          </div>
        </div>

        {/* Enrollments List */}
        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Learning Journey!</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
              You haven't enrolled in any courses yet. Discover amazing courses and start learning today.
            </p>
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium text-lg">
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getDifficultyIcon(enrollment.Course.difficulty)}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {enrollment.Course.title}
                          </h3>
                          <span className={getDifficultyColor(enrollment.Course.difficulty)}>
                            {enrollment.Course.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {enrollment.Course.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">🏷️</span>
                        <span className="font-medium">{enrollment.Course.code}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">📅</span>
                        <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">👤</span>
                        <span>Student: {enrollment.studentEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                    <button className="px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg">
                      📖 View Course
                    </button>
                    <button className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg">
                      🏆 Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                🔍 Browse More Courses
              </button>
            </Link>

            <button 
              onClick={fetchUserAndEnrollments}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              🔄 Refresh List
            </button>
          </div>
        </div>
      </div>
    </div>
    </Layout>

  );
}