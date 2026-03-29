import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    lines: ['123 Green Valley Road', 'Fresh Market, FL 32801'],
  },
  {
    icon: Phone,
    title: 'Call Us',
    lines: ['+1 (800) 123-4567', '+91 98765 43210'],
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: ['support@leafcart.com', 'orders@leafcart.com'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    lines: ['Mon – Sat: 7 AM – 10 PM', 'Sunday: 8 AM – 8 PM'],
  },
];

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    // Simulate send
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className="mt-20 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pb-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight border-l-4 border-green-500 pl-4">
          Contact Us
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 ml-5">
          We'd love to hear from you — reach out anytime!
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {contactInfo.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                  {item.lines.map((line, i) => (
                    <p key={i} className="text-sm text-gray-500 mt-0.5">{line}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Send us a Message
            </h2>
            <p className="text-sm text-gray-500 !mt-0">
              Fill out the form below and we'll respond within 24 hours.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Order inquiry, feedback, etc."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell us what's on your mind..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-lg shadow-green-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
