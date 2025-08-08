import React, { useState } from 'react';
import Select from "react-dropdown-select";
import { ToastContainer, toast } from 'react-toastify';
import { HashLoader } from "react-spinners";
import 'react-toastify/dist/ReactToastify.css';

const yearOptions = [
  { id: "I", name: "I" },
  { id: "II", name: "II" },
  { id: "III", name: "III" },
  { id: "IV", name: "IV" },
];

const teamSizeOptions = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
];

function EventRegistration() {
  const [formData, setFormData] = useState({
    teamName: "",
    collegeName: "",
    leaderName: "",
    phone: "",
    email: "",
    leaderYear: "",
    leaderDept: "",
    teamSize: "",
  });

  const [members, setMembers] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const validateMembers = () => {
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (!member.name || !member.year || !member.dept) {
        toast.error(`Please complete all fields for Member ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.teamName || !formData.leaderName || !formData.phone || !formData.email || !formData.collegeName) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      toast.error("Enter a valid email address.");
      return;
    }

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    if (members.length < 1 || members.length > 3) {
      toast.error("Team must have 1 to 3 members (excluding leader).");
      return;
    }

    if (!validateMembers()) {
      return;
    }

    try {
      setIsSubmit(true);

      const memberData = members.reduce((acc, member, i) => {
        acc[`memberName${i + 1}`] = member.name;
        acc[`memberYear${i + 1}`] = member.year;
        acc[`memberDept${i + 1}`] = member.dept;
        return acc;
      }, {});

      const fullData = {
        ...formData,
        ...memberData
      };

      const formBody = new URLSearchParams(fullData).toString();

      const response = await fetch(import.meta.env.VITE_REGISTRATION_LINK, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (response.ok) {
        toast.success("Registration submitted successfully!");
        setFormData({
          teamName: "",
          collegeName: "",
          leaderName: "",
          phone: "",
          email: "",
          leaderYear: "",
          leaderDept: "",
          teamSize: "",
        });
        setMembers([]);
      } else {
        toast.error("Failed to submit. Try again later.");
      }
    } catch (error) {
      toast.error("Submission error. Please try again.");
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-start px-4 py-10 min-h-screen">
        <div className="bg-red-50 bg-opacity-80 rounded-2xl p-8 max-w-5xl w-full shadow-md">
          <h1 className="text-2xl font-bold text-red-700 text-center mb-8">Event Team Registration</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Team Name", name: "teamName" },
                { label: "College Name", name: "collegeName" },
                { label: "Name (Leader)", name: "leaderName" },
                { label: "Dept (Leader)", name: "leaderDept" },
                { label: "Phone (Leader)", name: "phone" },
                { label: "Email (Leader)", name: "email", type: "email" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="font-semibold">{label}</label>
                  <input
                    name={name}
                    type={type || "text"}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-xl border-2 border-red-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="font-semibold">Year (Leader)</label>
                <Select
                  options={yearOptions}
                  labelField="name"
                  valueField="id"
                  values={formData.leaderYear ? [{ id: formData.leaderYear, name: formData.leaderYear }] : []}
                  onChange={(values) => {
                    setFormData({ ...formData, leaderYear: values[0]?.id || "" });
                  }}
                  placeholder="Select leader year"
                  style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                />
              </div>

              <div>
                <label className="font-semibold">Number of Team Members (excluding Leader)</label>
                <Select
                  options={teamSizeOptions}
                  labelField="name"
                  valueField="id"
                  values={formData.teamSize ? [{ id: formData.teamSize, name: formData.teamSize }] : []}
                  onChange={(values) => {
                    const selectedSize = values[0]?.id || "";
                    setFormData((prev) => ({ ...prev, teamSize: selectedSize }));

                    const size = parseInt(selectedSize) || 0;
                    const newMembers = Array.from({ length: size }, () => ({
                      name: "",
                      year: "",
                      dept: "",
                    }));
                    setMembers(newMembers);
                  }}
                  placeholder="Select number of members"
                  style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                />
              </div>
            </div>

            {members.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-red-700 mt-8">Team Members</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {members.map((member, index) => (
                    <div key={index} className="space-y-2 bg-red-100 bg-opacity-30 p-4 rounded-xl border border-red-200">
                      <label className="font-semibold">Member {index + 1} Name</label>
                      <input
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                        placeholder="Member name"
                        required
                      />
                      <label className="font-semibold">Year</label>
                      <Select
                        options={yearOptions}
                        labelField="name"
                        valueField="id"
                        values={member.year ? [{ id: member.year, name: member.year }] : []}
                        onChange={(values) => handleMemberChange(index, "year", values[0]?.id || "")}
                        placeholder="Select year"
                        style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                      />
                      <label className="font-semibold">Dept</label>
                      <input
                        value={member.dept}
                        onChange={(e) => handleMemberChange(index, "dept", e.target.value)}
                        className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                        placeholder="Department"
                        required
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmit}
              className={`w-full mt-6 py-3 rounded-2xl font-bold text-white ${isSubmit ? "bg-red-300" : "bg-red-700 hover:bg-red-800"} flex justify-center items-center gap-3`}
            >
              {isSubmit ? <HashLoader size={20} color="#fff" /> : "Submit Registration"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventRegistration;
