import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('min-words', 'Name must contain at least two words', (value) => {
      return value && value.trim().split(/\s+/).length >= 2;
    }),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please enter a valid email format'
    ),
  nic: yup
    .string()
    .required('NIC is required')
    .test('nic-format', 'Please enter a valid NIC number', (value) => {
      if (!value) return false;
      // Old format: 9 digits + V/X
      const oldFormat = /^[0-9]{9}[VX]$/i;
      // New format: 12 digits (first 4 as birth year)
      const newFormat = /^[0-9]{12}$/;
      return oldFormat.test(value) || newFormat.test(value);
    }),
  phone: yup
    .string()
    .required('Phone number is required')
    .test('phone-format', 'Please enter a valid Sri Lankan phone number', (value) => {
      if (!value) return false;
      // Accepts: 0XXXXXXXXX, +94XXXXXXXXX, or 9 digits without country code
      const phoneRegex = /^(\+94|0)?[0-9]{9}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    }),
  address: yup.object({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    district: yup.string().required('District is required'),
    postalCode: yup.string().required('Postal code is required')
  }),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const Register = () => {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;
    // Add passwordConfirm for backend
    const submitData = {
      ...userData,
      passwordConfirm: confirmPassword
    };
    console.log('Submitting data:', submitData);
    const result = await registerUser(submitData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our boat service community
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="nic" className="block text-sm font-medium text-gray-700">
                    NIC Number *
                  </label>
                  <input
                    {...register('nic')}
                    type="text"
                    className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      errors.nic ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 199012345678 or 901234567V"
                  />
                  {errors.nic && (
                    <p className="mt-1 text-sm text-red-600">{errors.nic.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="mt-1 flex">
                    <select className="px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 text-sm">
                      <option value="LK">🇱🇰 Sri Lanka</option>
                    </select>
                    <input
                      {...register('phone')}
                      type="tel"
                      className={`flex-1 px-3 py-2 border rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="077 123 4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Address Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        Street Address *
                      </label>
                      <input
                        {...register('address.street')}
                        type="text"
                        className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                          errors.address?.street ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.address?.street && (
                        <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City *
                        </label>
                        <input
                          {...register('address.city')}
                          type="text"
                          className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                            errors.address?.city ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Colombo"
                        />
                        {errors.address?.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                          District *
                        </label>
                        <input
                          {...register('address.district')}
                          type="text"
                          className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                            errors.address?.district ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Western Province"
                        />
                        {errors.address?.district && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.district.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code *
                        </label>
                        <input
                          {...register('address.postalCode')}
                          type="text"
                          className={`mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                            errors.address?.postalCode ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="00100"
                        />
                        {errors.address?.postalCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FaEye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      {...register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="h-4 w-4 text-gray-400" />
                      ) : (
                        <FaEye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
