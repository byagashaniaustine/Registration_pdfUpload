import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [residence, setResidence] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");

    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      // Upload the file
      const uploadRes = await fetch("/api/uploadFile", {
        method: "POST",
        body: fileFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "File upload failed.");

      const fileUrl: string = uploadData.fileUrl;

      // Submit registration data
      const registrationData = { firstName, lastName, occupation, residence, fileUrl };

      const registrationRes = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!registrationRes.ok) {
        const regData = await registrationRes.json();
        throw new Error(regData.message || "Registration failed.");
      }

      // Redirect to success page
      navigate("/success");
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert("Unknown error occurred");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFile(files && files.length > 0 ? files[0] : null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleSubmit}
        className="bg-emerald-500 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-white">
          Register & Upload PDF
        </h1>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Occupation"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Residence area"
          value={residence}
          onChange={(e) => setResidence(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
          required
          aria-label="Upload PDF file"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Registration;
