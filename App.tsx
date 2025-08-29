import React, { useState } from 'react';
import { User, UserCheck, Eye, EyeOff, Building2 } from 'lucide-react';
import WeeklySchedule from './components/WeeklySchedule';
import PreviousWeeks from './components/PreviousWeeks';
import NutritionTracker from './components/NutritionTracker';

type LoginMode = 'admin' | 'student';
type AppState = 'login' | 'dashboard' | 'previous-weeks' | 'nutrition';

interface LoginFormData {
  email: string;
  registrationNo: string;
  password: string;
  rememberMe: boolean;
}

function App() {
  const [loginMode, setLoginMode] = useState<LoginMode>('student');
  const [appState, setAppState] = useState<AppState>('login');
  const [loggedInUserType, setLoggedInUserType] = useState<LoginMode>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    registrationNo: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Check for remembered login on component mount
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('smartMessUser');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      setLoggedInUserType(userData.type);
      setAppState('dashboard');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (loginMode === 'admin') {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    } else {
      if (!formData.registrationNo) {
        newErrors.registrationNo = 'Registration number is required';
      } else if (formData.registrationNo.length < 4) {
        newErrors.registrationNo = 'Registration number must be at least 4 characters';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      setLoggedInUserType(loginMode);
      
      // Save login state if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('smartMessUser', JSON.stringify({
          type: loginMode,
          timestamp: Date.now()
        }));
      }
      
      setAppState('dashboard');
    }, 1500);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackToLogin = () => {
    setAppState('login');
    localStorage.removeItem('smartMessUser');
    setFormData({
      email: '',
      registrationNo: '',
      password: '',
      rememberMe: false
    });
  };

  const handleNavigateToPage = (page: AppState) => {
    setAppState(page);
  };

  if (appState === 'dashboard') {
    return (
      <WeeklySchedule 
        onBack={handleBackToLogin} 
        userType={loggedInUserType}
        onNavigate={handleNavigateToPage}
      />
    );
  }

  if (appState === 'previous-weeks') {
    return <PreviousWeeks onBack={() => setAppState('dashboard')} />;
  }

  if (appState === 'nutrition') {
    return <NutritionTracker onBack={() => setAppState('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Mess</h1>
          <p className="text-gray-600">Hostel Mess Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Role Switcher */}
          <div className="p-6 pb-0">
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => setLoginMode('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                  loginMode === 'student'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 font-medium ${
                  loginMode === 'admin'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Admin
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 pt-0">
            <div className="space-y-5">
              {/* Email/Registration Number Field */}
              <div>
                <label 
                  htmlFor={loginMode === 'admin' ? 'email' : 'registrationNo'} 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {loginMode === 'admin' ? 'Email Address' : 'Registration Number'}
                </label>
                <input
                  type={loginMode === 'admin' ? 'email' : 'text'}
                  id={loginMode === 'admin' ? 'email' : 'registrationNo'}
                  value={loginMode === 'admin' ? formData.email : formData.registrationNo}
                  onChange={(e) => handleInputChange(
                    loginMode === 'admin' ? 'email' : 'registrationNo', 
                    e.target.value
                  )}
                  placeholder={
                    loginMode === 'admin' 
                      ? 'Enter your email address' 
                      : 'Enter your registration number'
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    errors[loginMode === 'admin' ? 'email' : 'registrationNo']
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : loginMode === 'admin'
                      ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                />
                {errors[loginMode === 'admin' ? 'email' : 'registrationNo'] && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors[loginMode === 'admin' ? 'email' : 'registrationNo']}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : loginMode === 'admin'
                        ? 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    className={`w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-2 transition-colors ${
                      loginMode === 'admin'
                        ? 'text-orange-600 focus:ring-orange-500'
                        : 'text-blue-600 focus:ring-blue-500'
                    }`}
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className={`text-sm font-medium hover:underline transition-colors ${
                    loginMode === 'admin'
                      ? 'text-orange-600 hover:text-orange-700'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  loginMode === 'admin'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  `Sign in as ${loginMode === 'admin' ? 'Mess Manager' : 'Student'}`
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              {loginMode === 'admin' 
                ? 'Access mess management dashboard and analytics'
                : 'View meal plans, balance, and book meals'
              }
            </p>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact the{' '}
            <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
              mess administration
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;