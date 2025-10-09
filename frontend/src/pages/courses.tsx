import React, { useState, useEffect } from 'react';
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

interface CoursesResponse {
  data: Course[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    difficulty: '',
    title: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    code: '',
    difficulty: 'Beginner' as const
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    fetchCourses();
  }, [currentPage, filters]);

  const fetchCourses = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: currentPage.toString(),
      limit: '9',
      ...filters
    });

    // Remove empty filters
    Object.entries(filters).forEach(([key, value]) => {
      if (!value) queryParams.delete(key);
    });

    try {
      const response = await fetch(`http://localhost:8080/api/courses?${queryParams}`);
      const data: CoursesResponse = await response.json();
      setCourses(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-id': userId || '', 
        },
        body: JSON.stringify(createForm)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setCreateForm({ title: '', description: '', code: '', difficulty: 'Beginner' });
        fetchCourses();
      }
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleEnrollment = async (courseId: string) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    try {
      const response = await fetch('http://localhost:8080/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-client-id': userId || '', 
        },
        body: JSON.stringify({
          courseId: courseId
        })
      });

      if (response.ok) {
        alert('Successfully enrolled in the course!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to enroll');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'difficulty-badge-beginner';
      case 'Intermediate': return 'difficulty-badge-intermediate';
      case 'Advanced': return 'difficulty-badge-advanced';
      default: return 'bg-gray-100 text-gray-800 px-3 py-1 text-sm font-medium rounded-full';
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Course Catalog</h1>
            <p className="text-gray-600 text-lg">
              Discover and enroll in courses that match your learning goals
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary"
            >
              ➕ Create Course
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filter & Search</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search courses</label>
              <input
                type="text"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="Enter course title..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
              <select
                name="difficulty"
                value={filters.difficulty}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Levels</option>
                <option value="Beginner">🌱 Beginner</option>
                <option value="Intermediate">🌿 Intermediate</option>
                <option value="Advanced">🌳 Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sort by</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="createdAt">📅 Created Date</option>
                <option value="title">🔤 Title</option>
                <option value="difficulty">📊 Difficulty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Order</label>
              <select
                name="order"
                value={filters.order}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="desc">↓ Descending</option>
                <option value="asc">↑ Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Course Form */}
        {showCreateForm && (
          <div className="card bg-blue-50 border-blue-200">
            <h2 className="text-xl font-bold mb-6 text-blue-900">➕ Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  required
                  value={createForm.title}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input-field"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                <input
                  type="text"
                  required
                  value={createForm.code}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value }))}
                  className="input-field"
                  placeholder="e.g., CS101, MATH201"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="Describe what students will learn in this course"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={createForm.difficulty}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setCreateForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="Intermediate">🌿 Intermediate</option>
                  <option value="Advanced">🌳 Advanced</option>
                </select>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button
                  type="submit"
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-colors duration-200"
                >
                  ✅ Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-outline"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-gray-600">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading courses...
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <div className="text-xl text-gray-500 mb-4">No courses found</div>
            <p className="text-gray-400 mb-6">Try adjusting your search filters</p>
            <button
              onClick={() => setFilters({ difficulty: '', title: '', sortBy: 'createdAt', order: 'desc' })}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="card group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getDifficultyIcon(course.difficulty)}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {course.title}
                    </h3>
                  </div>
                  <span className={getDifficultyColor(course.difficulty)}>
                    {course.difficulty}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">🏷️</span>
                    <span className="font-medium">{course.code}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {isLoggedIn && (
                  <button
                    onClick={() => handleEnrollment(course.id)}
                    className="w-full btn-primary"
                  >
                    🎯 Enroll Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}