import React, { useRef, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Editor from "./Editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

// Validation schema using Yup
const validationSchema = Yup.object({
  slug: Yup.string().required("Slug is required"),
  title: Yup.string().required("Title is required"),
  thumbnail: Yup.string().url("Invalid URL").required("Thumbnail URL is required"),
  isDraft: Yup.boolean(),
});

const NewQuillComponent = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const quillRef = useRef();
  const token = import.meta.env.VITE_ADMIN_TOKEN;

  // Function to handle saving content
  const handleSave = async (values) => {
    const editor = quillRef.current?.getEditor();
    if (!editor) {
      console.error("Editor instance not available.");
      return;
    }

    const bodyContent = editor.getText().trim();
    if (!bodyContent) {
      console.error("Body content is empty.");
      return;
    }

    const payload = {
      slug: values.slug,
      title: values.title,
      body: bodyContent,
      thumbnail: values.thumbnail,
      content_type: "news",
      is_draft: values.isDraft,
    };

    try {
      const response = await fetch("http://136.228.158.126:50003/api/contents/", {
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

      // Reset Formik fields and Quill editor
      editor.setText("");
    } catch (error) {
      console.error("Failed to save content", error);
    }
  };

  return (
    <div className="ml-8 mt-8">
      <label htmlFor="body" className="block text-lg font-semibold mb-2">
        Body
      </label>
      <Editor ref={quillRef} readOnly={readOnly} />

      <Formik
        initialValues={{ slug: "", title: "", thumbnail: "", isDraft: false }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {() => (
          <Form className="form mt-6 space-y-4">
            <div className="form-group">
              <label htmlFor="slug" className="block text-gray-700 font-medium mb-1">
                Slug
              </label>
              <Field
                id="slug"
                name="slug"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage name="slug" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail" className="block text-gray-700 font-medium mb-1">
                Thumbnail URL
              </label>
              <Field
                id="thumbnail"
                name="thumbnail"
                type="text"
                className="border border-gray-300 p-2 rounded-md w-full"
              />
              <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="form-group">
              <label htmlFor="isDraft" className="block text-gray-700 font-medium mb-1">
                Is Draft
              </label>
              <Field
                id="isDraft"
                name="isDraft"
                type="checkbox"
                className="border border-gray-300 p-2 rounded-md"
              />
              <ErrorMessage name="isDraft" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mt-4"
              type="submit"
            >
              Add New
            </button>
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
              Successfully created content!
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

export default NewQuillComponent;
