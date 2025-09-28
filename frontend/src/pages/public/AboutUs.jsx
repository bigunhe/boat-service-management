import React from 'react';
import { FaShip, FaTools, FaUsers, FaAward, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About Marine Service Center</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Your trusted partner for comprehensive marine services, delivering excellence in boat repair, maintenance, rides, and sales since our founding.
          </p>
        </div>
      </div>

      {/* Company Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a passion for the sea and a commitment to excellence, Marine Service Center has been serving the boating community for over a decade. We understand that your boat is more than just a vessel—it's your gateway to adventure, relaxation, and unforgettable memories.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of certified marine technicians and experienced captains brings decades of combined expertise to every project. From routine maintenance to complex repairs, from scenic boat rides to helping you find your perfect vessel, we're here to make your marine experience exceptional.
              </p>
              <p className="text-lg text-gray-600">
                We pride ourselves on our attention to detail, use of premium materials, and commitment to customer satisfaction. Every service we provide is backed by our comprehensive warranty and our promise to exceed your expectations.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaShip className="text-teal-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                  <p className="text-gray-600">Boats Serviced</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-teal-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
                  <p className="text-gray-600">Happy Customers</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaTools className="text-teal-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">15+</h3>
                  <p className="text-gray-600">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <FaAward className="text-teal-600 text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                  <p className="text-gray-600">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are committed to providing exceptional marine services while upholding the highest standards of safety, quality, and customer care.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaShip className="text-teal-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every service we provide, using only the finest materials and most advanced techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-teal-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We listen to your needs and tailor our services to exceed your expectations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <FaAward className="text-teal-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrity</h3>
              <p className="text-gray-600">
                We conduct business with honesty, transparency, and respect for our customers, employees, and the marine environment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-300">
              Ready to experience the Marine Service Center difference? Contact us today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <FaMapMarkerAlt className="text-teal-400 text-2xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-300">
                Marina Bay, Port City<br />
                Colombo, Sri Lanka
              </p>
            </div>
            <div>
              <FaPhone className="text-teal-400 text-2xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-gray-300">
                +94 11 234 5678<br />
                Mon-Fri: 8AM-6PM
              </p>
            </div>
            <div>
              <FaEnvelope className="text-teal-400 text-2xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-gray-300">
                info@marineservice.com<br />
                support@marineservice.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
