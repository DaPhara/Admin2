import React, { useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Editor from "./Editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

const EventQuillComponent = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;

  const initialValues = {
    sport_category: "", 
    title: "",
    thumbnail: "",
    location: "",
    date: "",
    contactInfo: "",
    about: "",
    ticketPrice: "",
    ticketReference: "",
    venueMap: "",
    event_type: "", 
    slug: "",
  };

  const validationSchema = Yup.object({
    sport_category: Yup.string().required("Required"), 
    slug: Yup.string().required("Required"),
    title: Yup.string().required("Required"),
    thumbnail: Yup.string().url("Invalid URL").required("Required"),
    // location: Yup.string().required("Required"),
    date: Yup.date().required("Required"),
    // contactInfo: Yup.string().required("Required"),
    // about: Yup.string().required("Required"),
    ticketPrice: Yup.number().required("Required"),
    // ticketReference: Yup.string().required("Required"),
    // venueMap: Yup.string().url("Invalid URL").required("Required"),
    event_type: Yup.string().required("Required"), 
  });

  const handleSave = async (values) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) {
      console.error("Editor instance not available.");
      return;
    }

    const descriptionContent = editor.getText().trim();
    if (!descriptionContent) {
      console.error("Description content is empty.");
      return;
    }

    const payload = {
      ...values,
      description: descriptionContent,
      date: new Date(values.date).toISOString(),
      ticket_price: parseFloat(values.ticketPrice),
    };

    try {
      const response = await fetch("http://136.228.158.126:50003/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      console.log("Content saved successfully");

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to save content", error);
    }
  };

  return (
    <div className="ml-8 mt-8">
      <label htmlFor="description" className="block text-lg font-semibold mb-2">
        Description
      </label>
      <Editor ref={quillRef} readOnly={readOnly} />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {() => (
          <Form className="form mt-6 space-y-4">
            <div className="form-group">
              <label
                htmlFor="sport_category"
                className="block text-gray-700 font-medium mb-1"
              >
                Sport Category ID
              </label>
              <Field
                as="select"
                id="sport_category"
                name="sport_category"
                className="border border-gray-300 p-2 rounded-md w-full"
              >
                <option value="">Select a category</option>
                <option value="b4686c69-a4fb-4284-9a0c-8c8e271836f3">Football</option>
                <option value="f4c3597b-2155-4c63-9a7a-5dea3434ccaa">Basketball</option>
                <option value="2fe56924-fe8a-4ccd-8792-432fe3885692">Volleyball</option>
                <option value="6da6376b-932a-4f5c-a7aa-c70dacd7b705">Badminton</option>
              </Field>
              <ErrorMessage
                name="sport_category"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="slug"
                className="block text-gray-700 font-medium mb-1"
              >
                Slug
              </label>
              <Field
                id="slug"
                name="slug"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="slug"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-1"
              >
                Title
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="thumbnail"
                className="block text-gray-700 font-medium mb-1"
              >
                Thumbnail URL
              </label>
              <Field
                id="thumbnail"
                name="thumbnail"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="thumbnail"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-1"
              >
                Location
              </label>
              <Field
                id="location"
                name="location"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="date"
                className="block text-gray-700 font-medium mb-1"
              >
                Date
              </label>
              <Field
                id="date"
                name="date"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="contactInfo"
                className="block text-gray-700 font-medium mb-1"
              >
                Contact Info
              </label>
              <Field
                id="contactInfo"
                name="contactInfo"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="contactInfo"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="about"
                className="block text-gray-700 font-medium mb-1"
              >
                About
              </label>
              <Field
                id="about"
                name="about"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="about"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="ticketPrice"
                className="block text-gray-700 font-medium mb-1"
              >
                Ticket Price
              </label>
              <Field
                id="ticketPrice"
                name="ticketPrice"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="ticketPrice"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="ticketReference"
                className="block text-gray-700 font-medium mb-1"
              >
                Ticket Reference
              </label>
              <Field
                id="ticketReference"
                name="ticketReference"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="ticketReference"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="venueMap"
                className="block text-gray-700 font-medium mb-1"
              >
                Venue Map URL
              </label>
              <Field
                id="venueMap"
                name="venueMap"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="venueMap"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="event_type"
                className="block text-gray-700 font-medium mb-1"
              >
                Event Type
              </label>
              <Field
                id="event_type"
                name="event_type"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage
                name="event_type"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
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

export default EventQuillComponent;
