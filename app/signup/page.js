import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    countryCode: "",
    password: "",
    confirmPassword: "",
    dob: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    termsAccepted: false, // NEW field for terms checkbox
  });

  const [error, setError] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [countryCodes, setCountryCodes] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then((res) => {
        const sortedCountries = res.data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode: country.idd?.root ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "") : "",
          }))
          .filter((c) => c.dialCode)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(sortedCountries);
        setCountryCodes(sortedCountries);
      })
      .catch(() => setError("Failed to load countries"));
  }, []);

  useEffect(() => {
    if (formData.country) {
      axios.get(`https://countriesnow.space/api/v0.1/countries/states`, { params: { country: formData.country } })
        .then((res) => {
          if (res.data.data.states) {
            setStates(res.data.data.states.map((state) => state.name));
          }
        })
        .catch(() => setError("Failed to load states"));
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validatePhoneNumber = () => {
    if (!formData.countryCode || !formData.phoneNumber) return false;
    const phoneNumber = parsePhoneNumberFromString(formData.phoneNumber, formData.countryCode);
    return phoneNumber && phoneNumber.isValid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!validatePhoneNumber()) {
      setError("Invalid phone number for selected country");
      return;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the Terms and Conditions to proceed.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/signup", formData);
      router.push("/verification");
    } catch {
      setError("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input name="firstName" placeholder="First Name" onChange={handleChange} required />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      
      {/* Phone Number Section */}
      <select name="countryCode" onChange={handleChange} required>
        <option value="">Select Country Code</option>
        {countryCodes.map((c, index) => (
          <option key={index} value={c.code}>
            {c.name} ({c.dialCode})
          </option>
        ))}
      </select>
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />

      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
      <input type="date" name="dob" onChange={handleChange} required />

      {/* Address Fields */}
      <input name="street" placeholder="Street Address" onChange={handleChange} required />
      <input name="city" placeholder="City" onChange={handleChange} required />

      {/* Country Selection */}
      <select name="country" onChange={handleChange} required>
        <option value="">Select Country</option>
        {countries.map((country, index) => (
          <option key={index} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>

      {/* State Selection (Dynamic) */}
      <select name="state" onChange={handleChange} required>
        <option value="">Select State</option>
        {states.map((state, index) => (
          <option key={index} value={state}>
            {state}
          </option>
        ))}
      </select>

      <input name="postalCode" placeholder="Postal Code" onChange={handleChange} required />

      {/* Terms & Conditions Checkbox */}
      <div>
        <input type="checkbox" id="termsAccepted" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} />
        <label htmlFor="termsAccepted">
          I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>
        </label>
      </div>

      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
