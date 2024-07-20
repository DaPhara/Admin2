import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import moment from "moment";

export default function User() {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [userToDelete, setUserToDelete] = useState(null);
  const [nextPage, setNextPage] = useState(null); // To store the next page URL

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const usersEndPoint = import.meta.env.VITE_ALLUSER_URL;
  const apiUrl = `${baseUrl}${usersEndPoint}`;

  useEffect(() => {
    const fetchUsers = async () => {
      let allUsers = [];
      let nextUrl = apiUrl;

      while (nextUrl) {
        try {
          const response = await fetch(nextUrl, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            allUsers = [...allUsers, ...data.results]; // Adjust according to your API's response structure
            nextUrl = data.next; // Update the next URL from the API response
          } else {
            console.error("Failed to fetch users");
            break;
          }
        } catch (error) {
          console.error("Error:", error);
          break;
        }
      }
      setUsers(allUsers);
    };

    fetchUsers();
  }, [apiUrl]);

  // Handle view user details
  const handleUserDetails = (user) => {
    setUserDetails(user);
    setShowUserModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    const deleteUrl = `${apiUrl}${userToDelete}/`; // Construct the delete endpoint URL

    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`, // Include the access token in the request headers
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userToDelete));
        setShowDeleteModal(false);
        setShowSuccessModal(true); // Show success modal after deletion
      } else {
        console.error("Failed to delete the user");
        // Handle error case
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error case
    }
  };

  const columns = [
    {
      name: "User Name",
      selector: (row) => row.username,
    },
    {
      name: "Role",
      selector: (row) => row.role.name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Status",
      selector: (row) => (
        <span
          className={`font-semibold flex items-center justify-center w-20 h-8 rounded-full text-slate-700 border-2
            ${
              row.is_deleted
                ? "bg-red-200 border-red-400"
                : row.role.name === "admin"
                ? "bg-green-200 border-green-400"
                : !row.is_verified
                ? "bg-yellow-200 border-yellow-400"
                : "bg-green-200 border-green-400"
            }
          `}
        >
          {row.is_deleted
            ? "Inactive"
            : row.role.name === "admin"
            ? "Active"
            : !row.is_verified
            ? "Pending"
            : "Active"}
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUserDetails(row)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
      },
    },
  };

  return (
    <section className="mt-14 xl:ml-64 p-0 min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">All Users</h1>
        <DataTable
          className="no-scrollbar"
          columns={columns}
          data={users}
          fixedHeader
          pagination
          pointerOnHover
          highlightOnHover
          customStyles={customStyles}
        />
      </div>

      {/* User details modal */}
      <Modal show={showUserModal} onClose={() => setShowUserModal(false)}>
        <Modal.Header>User Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4 p-6 bg-white dark:bg-gray-800 dark:text-gray-200">
            <div className="flex justify-center">
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 dark:border-gray-600"
                src={
                  userDetails?.profile_image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"
                }
                alt="User Avatar"
              />
            </div>
            <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">
              {userDetails?.username || "Unknown"}
            </h2>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              {userDetails?.role?.name || "No role available."}
            </p>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              {userDetails?.email || "No email available."}
            </p>
            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
              CreateDate:
              {" " + moment(userDetails?.created_at).format("YYYY-MM-DD") ||
                "No date available."}
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => setShowDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success modal */}
      {showSuccessModal && (
        <div
          id="successModal"
          className="fixed top-0 right-0 left-0 bottom-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div className="relative p-4 w-full max-w-md">
            <div className="relative p-4 text-center bg-white rounded-lg shadow">
              <button
                type="button"
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={() => setShowSuccessModal(false)}
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
              <p className="mb-4 text-lg font-semibold text-gray-900">
                Successfully removed user.
              </p>
              <button
                type="button"
                className="py-2 px-3 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
                onClick={() => setShowSuccessModal(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
