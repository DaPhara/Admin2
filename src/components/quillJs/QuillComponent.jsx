import React, { useRef, useState } from "react";
import Editor from "./Editor";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

// Validation schema for Formik
const validationSchema = Yup.object().shape({
  sportCategory: Yup.string().required(
    "Sport Category is required and cannot be blank."
  ),
  slug: Yup.string().required("Slug is required and cannot be blank."),
  sportName: Yup.string().required(
    "Sport Name is required and cannot be blank."
  ),
  latitude: Yup.number().required("Latitude is required and cannot be blank."),
  longitude: Yup.number().required(
    "Longitude is required and cannot be blank."
  ),
  seatNumber: Yup.number().required(
    "Seat Number is required and cannot be blank."
  ),
  skillLevel: Yup.string().required(
    "Skill Level is required and cannot be blank."
  ),
  price: Yup.string().required("Price is required and cannot be blank."),
});

const QuillComponent = () => {
  // Ref for Quill editor instance and admin token
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;

  // State for success modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Function to handle saving form data
  const handleSave = async (values) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) {
      console.error("Editor instance not available.");
      return;
    }

    const descriptionContent = editor.root.innerHTML;
    if (!descriptionContent) {
      console.error("Description content is empty.");
      return;
    }

    // Prepare payload for POST request
    const payload = {
      sport_category: values.sportCategory,
      slug: values.slug,
      sport_name: values.sportName,
      latitude: parseFloat(values.latitude),
      longitude: parseFloat(values.longitude),
      seat_number: parseInt(values.seatNumber, 10),
      skill_level: values.skillLevel,
      description: descriptionContent,
      image: values.image,
      reviews: values.reviews,
      profile: values.profile,
      cover: values.cover,
      price: values.price,
      contact_info: {
        first_phone: values.firstPhone,
        second_phone: values.secondPhone,
        email: values.email,
        website: values.website,
        facebook: values.facebook,
        telegram: values.telegram,
        instagram: values.instagram,
        twitter: values.twitter,
        istad_account: values.istadAccount,
      },
    };

    try {
      const response = await fetch(
        "http://136.228.158.126:50003/api/sportclubs/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      // Show success modal after successful save
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save content", error);
    }
  };

  return (
    <div className="ml-8 mt-8">
      {/* Formik form */}
      <Formik
        initialValues={{
          sportCategory: "",
          slug: "",
          sportName: "",
          latitude: "",
          longitude: "",
          seatNumber: "",
          skillLevel: "",
          image: "",
          reviews: "",
          profile: "",
          cover: "",
          price: "",
          firstPhone: "",
          secondPhone: "",
          email: "",
          website: "",
          facebook: "",
          telegram: "",
          instagram: "",
          twitter: "",
          istadAccount: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ setFieldValue }) => (
          <Form className="form mt-6 space-y-4">
            {/* Description Editor */}
            <label
              htmlFor="description"
              className="block text-lg font-semibold mb-2"
            >
              Description
            </label>
            <Editor ref={quillRef} />

            {/* Sport Category Select */}
            <div className="form-group">
              <label
                htmlFor="sportCategory"
                className="block text-gray-700 font-medium mb-1"
              >
                Sport Category ID
              </label>
              <Field
                as="select"
                name="sportCategory"
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="">Select a category</option>
                <option value="b4686c69-a4fb-4284-9a0c-8c8e271836f3">
                  Football
                </option>
                <option value="f4c3597b-2155-4c63-9a7a-5dea3434ccaa">
                  Basketball
                </option>
                <option value="2fe56924-fe8a-4ccd-8792-432fe3885692">
                  Volleyball
                </option>
                <option value="6da6376b-932a-4f5c-a7aa-c70dacd7b705">
                  Badminton
                </option>
              </Field>
              <ErrorMessage
                name="sportCategory"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Slug Input */}
            <div className="form-group">
              <label
                htmlFor="slug"
                className="block text-gray-700 font-medium mb-1"
              >
                Slug
              </label>
              <Field
                name="slug"
                type="text"
                placeholder="Enter slug"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="slug"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Sport Name Input */}
            <div className="form-group">
              <label
                htmlFor="sportName"
                className="block text-gray-700 font-medium mb-1"
              >
                Sport Name
              </label>
              <Field
                name="sportName"
                type="text"
                placeholder="Enter sport name"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="sportName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Latitude Input */}
            <div className="form-group">
              <label
                htmlFor="latitude"
                className="block text-gray-700 font-medium mb-1"
              >
                Latitude
              </label>
              <Field
                name="latitude"
                type="text"
                placeholder="Enter latitude"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="latitude"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Longitude Input */}
            <div className="form-group">
              <label
                htmlFor="longitude"
                className="block text-gray-700 font-medium mb-1"
              >
                Longitude
              </label>
              <Field
                name="longitude"
                type="text"
                placeholder="Enter longitude"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="longitude"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Seat Number Input */}
            <div className="form-group">
              <label
                htmlFor="seatNumber"
                className="block text-gray-700 font-medium mb-1"
              >
                Seat Number
              </label>
              <Field
                name="seatNumber"
                type="text"
                placeholder="Enter seat number"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="seatNumber"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Skill Level Input */}
            <div className="form-group">
              <label
                htmlFor="skillLevel"
                className="block text-gray-700 font-medium mb-1"
              >
                Skill Level
              </label>
              <Field
                name="skillLevel"
                type="text"
                placeholder="Enter skill level"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="skillLevel"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Image URL Input */}
            <div className="form-group">
              <label
                htmlFor="image"
                className="block text-gray-700 font-medium mb-1"
              >
                Image URL
              </label>
              <Field
                name="image"
                type="text"
                placeholder="Enter image URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Reviews Input */}
            <div className="form-group">
              <label
                htmlFor="reviews"
                className="block text-gray-700 font-medium mb-1"
              >
                Reviews
              </label>
              <Field
                name="reviews"
                type="text"
                placeholder="Enter reviews"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="reviews"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Profile Input */}
            <div className="form-group">
              <label
                htmlFor="profile"
                className="block text-gray-700 font-medium mb-1"
              >
                Profile
              </label>
              <Field
                name="profile"
                type="text"
                placeholder="Enter profile"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="profile"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Cover Input */}
            <div className="form-group">
              <label
                htmlFor="cover"
                className="block text-gray-700 font-medium mb-1"
              >
                Cover
              </label>
              <Field
                name="cover"
                type="text"
                placeholder="Enter cover"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="cover"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Price Input */}
            <div className="form-group">
              <label
                htmlFor="price"
                className="block text-gray-700 font-medium mb-1"
              >
                Price
              </label>
              <Field
                name="price"
                type="text"
                placeholder="Enter price"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="price"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Contact Information Inputs */}
            <h3 className="text-lg font-semibold mt-4">Contact Information</h3>

            <div className="form-group">
              <label
                htmlFor="firstPhone"
                className="block text-gray-700 font-medium mb-1"
              >
                First Phone
              </label>
              <Field
                name="firstPhone"
                type="text"
                placeholder="Enter first phone number"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="firstPhone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="secondPhone"
                className="block text-gray-700 font-medium mb-1"
              >
                Second Phone
              </label>
              <Field
                name="secondPhone"
                type="text"
                placeholder="Enter second phone number"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="secondPhone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <Field
                name="email"
                type="email"
                placeholder="Enter email address"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="website"
                className="block text-gray-700 font-medium mb-1"
              >
                Website
              </label>
              <Field
                name="website"
                type="url"
                placeholder="Enter website URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="website"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="facebook"
                className="block text-gray-700 font-medium mb-1"
              >
                Facebook
              </label>
              <Field
                name="facebook"
                type="url"
                placeholder="Enter Facebook URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="facebook"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="telegram"
                className="block text-gray-700 font-medium mb-1"
              >
                Telegram
              </label>
              <Field
                name="telegram"
                type="url"
                placeholder="Enter Telegram URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="telegram"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="instagram"
                className="block text-gray-700 font-medium mb-1"
              >
                Instagram
              </label>
              <Field
                name="instagram"
                type="url"
                placeholder="Enter Instagram URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="instagram"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="twitter"
                className="block text-gray-700 font-medium mb-1"
              >
                Twitter
              </label>
              <Field
                name="twitter"
                type="url"
                placeholder="Enter Twitter URL"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="twitter"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="istadAccount"
                className="block text-gray-700 font-medium mb-1"
              >
                Istad Account
              </label>
              <Field
                name="istadAccount"
                type="text"
                placeholder="Enter Istad account"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="istadAccount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="form-group">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 max-w-lg rounded-md shadow-lg relative">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
            > 
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="w-12 h-12 rounded-full bg-green-100 p-2 flex items-center justify-center mx-auto mb-3.5">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Success</span>
            </div>
            <p className="text-lg font-semibold mb-8 text-gray-900">
              Successfully created Sport Club!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuillComponent;
