import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = () => {
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({ image: '', category: '' });

  useEffect(() => {
    axios.get('http://localhost:8080/plans/getAllCategories')
      .then(response => {
        setSubmissions(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSave = (submissionData) => {
    axios.put(`http://localhost:8080/plans/getAllCategories${submissionData.id}`, submissionData)
      .then(response => {
        console.log('Submission data updated successfully:', response.data);
        setSubmissions(prevSubmissions => prevSubmissions.map(submission =>
          submission.id === submissionData.id ? { ...submission, ...submissionData } : submission
        ));
      })
      .catch(error => {
        console.error('Error updating submission data:', error);
      });
  };

  const handleDelete = (submissionId) => {
    setSubmissions(prevSubmissions => prevSubmissions.filter(submission => submission.id !== submissionId));

    axios.delete(`http://localhost:8080/plans/getAllCategories${submissionId}`)
      .then(response => {
        console.log('Submission deleted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error deleting submission:', error);
        axios.get('http://localhost:3000/category')
          .then(response => {
            setSubmissions(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      });
  };

  const handleInputChange = (submissionId, field, value) => {
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission.id === submissionId ? { ...submission, [field]: value } : submission
      )
    );
  };

  const handleFileChange = (e, submissionId) => {
    const selectedFile = e.target.files[0];
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(submission =>
        submission.id === submissionId ? { ...submission, image: selectedFile } : submission
      )
    );
  };

  const handleAdd = () => {
    axios.post('http://localhost:3000/category', newSubmission)
      .then(response => {
        console.log('New category added successfully:', response.data);
        setSubmissions(prevSubmissions => [...prevSubmissions, response.data]);
        setNewSubmission({ image: '', category: '' });
      })
      .catch(error => {
        console.error('Error adding new category:', error);
      });
  };

  return (
    <div className="p-4 flex justify-center mt-28 ml-36">
    <table className="w-full sm:w-11/12 md:w-5/6 lg:w-4/5 xl:w-4/5 bg-white border border-gray-300">
        <thead className="bg-[#9DB2BF] text-white">
          <tr>
            <th className="py-2 px-4">Image</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={index}
              className={`border-b hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
            >
              <td className="py-2 px-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, submission.id)}
                />
              </td>
              <td className="py-2 px-4">
                <input
                  type="text"
                  value={submission.category}
                  className="w-full bg-transparent"
                  onChange={(e) => handleInputChange(submission.id, 'category', e.target.value)}
                />
              </td>
              <td className="py-2 px-4 flex justify-end space-x-2">
                <button
                  type="button"
                  className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleSave(submission)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDelete(submission.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr className="border-b hover:bg-gray-100">
            <td className="py-2 px-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewSubmission({ ...newSubmission, image: e.target.files[0] })}
              />
            </td>
            <td className="py-2 px-4">
              <input
                type="text"
                value={newSubmission.category}
                className="w-full bg-transparent"
                placeholder="New Category"
                onChange={(e) => setNewSubmission({ ...newSubmission, category: e.target.value })}
              />
            </td>
            <td className="py-2 px-4 flex justify-end">
              <button
                type="button"
                className="text-sm bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={handleAdd}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Category;