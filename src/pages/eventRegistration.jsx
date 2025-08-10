import React, { useState } from 'react';
import Select from "react-dropdown-select";
import { ToastContainer, toast } from 'react-toastify';
import { HashLoader } from "react-spinners";
import 'react-toastify/dist/ReactToastify.css';
import WA_QR from "../assets/WA_QR.png";

const yearOptions = [
  { id: "I", name: "I" },
  { id: "II", name: "II" },
  { id: "III", name: "III" },
  { id: "IV", name: "IV" },
];

const teamSizeOptions = [
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
];

const collegeOptions = [
  { id: "Rajalakshmi Institute of Technology", name: "Rajalakshmi Institute of Technology" },
  { id: "Other", name: "Other" }
];

function EventRegistration() {
  const [formData, setFormData] = useState({
    teamName: "",
    collegeName: "",
    teamSize: "",
    collegeType: ""
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
        toast.error(`Please complete all fields for ${i === 0 ? "Leader" : `Member ${i + 1}`}`);
        return false;
      }
      if (formData.collegeType === "Rajalakshmi Institute of Technology" && !member.rollNo) {
        toast.error(`Please enter roll number for ${i === 0 ? "Leader" : `Member ${i + 1}`}`);
        return false;
      }
      if (i === 0) {
        if (!member.phone || !/^\d{10}$/.test(member.phone)) {
          toast.error("Leader's phone number must be 10 digits.");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(member.email)) {
          toast.error("Enter a valid leader email address.");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.teamName || !formData.collegeName) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (members.length < 2 || members.length > 4) {
      toast.error("Team must have between 2 and 4 members (including leader).");
      return;
    }

    if (!validateMembers()) return;

    try {
      setIsSubmit(true);

      const memberData = members.reduce((acc, member, i) => {
        if (i === 0) {
          acc["leaderName"] = member.name;
          acc["leaderYear"] = member.year;
          acc["leaderDept"] = member.dept;
          acc["leaderPhone"] = member.phone;
          acc["leaderEmail"] = member.email;
          if (formData.collegeType === "Rajalakshmi Institute of Technology") acc["leaderRollNo"] = member.rollNo;
        } else {
          acc[`member${i + 1}Name`] = member.name;
          acc[`member${i + 1}Year`] = member.year;
          acc[`member${i + 1}Dept`] = member.dept;
          if (formData.collegeType === "Rajalakshmi Institute of Technology") acc[`member${i + 1}RollNo`] = member.rollNo;
        }
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
        setFormData({ teamName: "", collegeName: "", teamSize: "", collegeType: "" });
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
        <div className="glass-card p-4 w-full max-w-4xl">
          <h1 className="glass-card p-4 text-2xl font-bold text-white text-center mb-8">Serve-a-thon Team Registration</h1>

          <ul class="glass-card p-4 mb-8 list-disc list-inside space-y-2 text-white">
            <li>Team Size: 2 to 4 students</li>
            <li>
              Two Phases:
              <ul class="list-decimal list-inside ml-5 space-y-1 mt-1">
                <li>Phase 1: Submit idea as PPT</li>
                <li>Phase 2: Selected teams build &amp; present prototype</li>
              </ul>
            </li>
            <li>Theme: Health, Safety &amp; Human Welfare</li>
            <li>Original Work Only – No copying</li>
            <li>Submit via Google Form / Drive (as instructed)</li>
            <li>Judging Criteria: Innovation, Relevance, Execution, Impact, UI</li>
            <li>
              Certificates:
              <ul class="list-disc list-inside ml-5 space-y-1 mt-1">
                <li>Participation (PPT submitters)</li>
                <li>Winners &amp; Special Awards for top teams</li>
              </ul>
            </li>
            <li>Be respectful. Misconduct leads to disqualification</li>
          </ul>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold text-white">Team Name</label>
                <input
                  name="teamName"
                  type="text"
                  value={formData.teamName}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-xl border-2 border-red-200 px-4 py-2"
                  placeholder="Enter team name"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-white">College</label>
                <Select
                  options={collegeOptions}
                  labelField="name"
                  valueField="id"
                  values={formData.collegeType ? [{ id: formData.collegeType, name: formData.collegeType }] : []}
                  onChange={(values) => {
                    const selected = values[0]?.id || "";
                    setFormData((prev) => ({
                      ...prev,
                      collegeType: selected,
                      collegeName: selected === "Rajalakshmi Institute of Technology" ? "Rajalakshmi Institute of Technology" : ""
                    }));
                  }}
                  placeholder="Select college"
                  style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                />
              </div>

              {formData.collegeType === "Other" && (
                <div>
                  <label className="font-semibold text-white">College Name</label>
                  <input
                    name="collegeName"
                    type="text"
                    value={formData.collegeName}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-xl border-2 border-red-200 px-4 py-2"
                    placeholder="Enter college name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-white">Number of Team Members</label>
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
                      phone: "",
                      email: "",
                      rollNo: ""
                    }));
                    setMembers(newMembers);
                  }}
                  placeholder="Select team size"
                  style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                />
              </div>
            </div>

            {members.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-white mt-8">Team Members</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {members.map((member, index) => (
                    <div key={index} className="glass-card space-y-2 p-4">
                      <h3 className="text-white font-bold mb-2">
                        {index === 0 ? "Leader" : `Member ${index + 1}`}
                      </h3>
                      <input
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                        placeholder="Full name"
                        required
                      />
                      <Select
                        options={yearOptions}
                        labelField="name"
                        valueField="id"
                        values={member.year ? [{ id: member.year, name: member.year }] : []}
                        onChange={(values) => handleMemberChange(index, "year", values[0]?.id || "")}
                        placeholder="Select year"
                        style={{ border: "2px solid #fecaca", borderRadius: "10px", padding: "10px", backgroundColor: "#fff" }}
                      />
                      <input
                        value={member.dept}
                        onChange={(e) => handleMemberChange(index, "dept", e.target.value)}
                        className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                        placeholder="Department"
                        required
                      />
                      {formData.collegeType === "Rajalakshmi Institute of Technology" && (
                        <input
                          value={member.rollNo}
                          onChange={(e) => handleMemberChange(index, "rollNo", e.target.value)}
                          className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                          placeholder="Roll Number"
                          required
                        />
                      )}
                      {index === 0 && (
                        <>
                          <input
                            value={member.phone}
                            onChange={(e) => handleMemberChange(index, "phone", e.target.value)}
                            className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                            placeholder="Leader phone"
                            required
                          />
                          <input
                            value={member.email}
                            onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                            className="w-full rounded-xl border-2 border-red-200 px-4 py-2"
                            placeholder="Leader email"
                            type="email"
                            required
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="w-full flex justify-center mt-6">
              <button
                type="submit"
                disabled={isSubmit}
                className={`w-60 mt-6 py-3 rounded-2xl font-bold text-white ${isSubmit ? "bg-red-300 cursor-not-allowed" : "bg-red-700 hover:bg-red-800 cursor-pointer"} flex justify-center items-center gap-3`}
              >
                {isSubmit ? <HashLoader size={20} color="#fff" /> : "Submit Registration"}
              </button>
            </div>
          </form>

          <div className="w-full flex flex-col justify-center items-center gap-6">
            <a className="w-60 mt-6 py-3 rounded-2xl font-bold text-white bg-gray-500 hover:bg-gray-700 cursor-pointer flex justify-center items-center gap-3" href="https://chat.whatsapp.com/Fu7ojrWR78f4b8cPXGGZd9?mode=ac_t">Click to join Whatsapp group</a>
            <p className="w-full text-white flex justify-center">OR SCAN THE QR</p>
            <img className="w-full max-w-64 rounded-2xl" src={WA_QR} />
          </div>
        </div>
      </div>
    </>
  );
}

export default EventRegistration;
