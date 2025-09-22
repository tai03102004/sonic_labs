import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

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

export default function Enrollments() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [totalEnrollments, setTotalEnrollments] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (!token || !email) {
      router.push('/login');
      return;
    }
    
    setUserEmail(email);
    fetchEnrollments(email);
  }, [router]);

  const fetchEnrollments = async (email: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/enrollments/students?email=${encodeURIComponent(email)}`);
      const data: EnrollmentsResponse = await response.json();
      
      if (response.ok) {
        setEnrollments(data.enrollments);
        setTotalEnrollments(data.totalEnrollments);
      } else {
        console.error('Failed to fetch enrollments');
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <Layout>
        <div className="text-center py-12">
          <div className="text-gray-500">Loading your enrollments...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Enrollments</h1>
            <p className="mt-2 text-gray-600">
              You are enrolled in {totalEnrollments} course{totalEnrollments !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalEnrollments}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {enrollments.filter(e => e.Course.difficulty === 'Beginner').length}
              </div>
              <div className="text-sm text-gray-600">Beginner Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {enrollments.filter(e => e.Course.difficulty === 'Advanced').length}
              </div>
              <div className="text-sm text-gray-600">Advanced Level</div>
            </div>
          </div>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">You have not enrolled in any courses yet.</div>
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {enrollment.Course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {enrollment.Course.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Code: <span className="font-medium">{enrollment.Course.code}</span></span>
                          <span>Enrolled: {formatDate(enrollment.enrolledAt)}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(enrollment.Course.difficulty)}`}>
                        {enrollment.Course.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      View Course
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500">
                      Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Browse More Courses
            </button>
            <button
              onClick={() => fetchEnrollments(userEmail)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Refresh List
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}