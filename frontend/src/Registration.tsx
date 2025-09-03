import { useState } from "react";

const Registration = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");
  const [residence, setResidence] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Uploading file...");

    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    try {
      // STEP 1: Upload the file
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const uploadRes = await fetch("/api/uploadFile", {
        method: "POST",
        body: fileFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "File upload failed.");

      setMessage("File uploaded. Registering user data...");
      const fileUrl: string = uploadData.fileUrl;

      // STEP 2: Submit the rest of the data
      const registrationData = {
        firstName,
        lastName,
        occupation,
        residence,
        fileUrl,
      };

      const registrationRes = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const registrationResult = await registrationRes.json();
      if (!registrationRes.ok) throw new Error(registrationResult.message || "Registration failed.");

      setMessage(registrationResult.message || "Registration completed successfully!");
    } catch (err: unknown) {
      setMessage(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
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

        {/* File input restored */}
    <input
  type="file"
  accept="application/pdf"
  onChange={handleFileChange}
  className="w-full border p-2 rounded text-white"
  required
  aria-label="Upload PDF"
  title="Upload PDF"
/>


        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-930"
        >
          Submit
        </button>

        {message && (
          <p className="text-center text-white font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Registration;
