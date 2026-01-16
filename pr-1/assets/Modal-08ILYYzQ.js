import{R as t,j as e}from"./client-_syZrnq6.js";/* empty css               */import{M as o}from"./Modal-BFMbPj3K.js";const n={isOpen:!0,onClose:"() => console.log('Modal closed')",title:"Create New Project Task",children:`<div>
  <form className="space-y-4">
    <div>
      <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">Task Name</label>
      <input type="text" id="taskName" name="taskName" placeholder="e.g., Implement user authentication module" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
    </div>
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
      <textarea id="description" name="description" rows="3" placeholder="Outline key functionalities for login, registration, and session management." className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input type="date" id="dueDate" name="dueDate" defaultValue="2024-08-10" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select id="priority" name="priority" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="High">High</option>
          <option value="Medium" selected>Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
    <div>
      <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">Assigned To</label>
      <select id="assignedTo" name="assignedTo" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
        <option value="">Select Team Member</option>
        <option value="johnDoe">John Chen</option>
        <option value="janeSmith">Sarah Patel</option>
        <option value="peterJones">Michael Rodriguez</option>
        <option value="annaLee">Emily Wong</option>
      </select>
    </div>
    <div className="flex justify-end pt-4 border-t border-gray-200 mt-4">
      <button type="button" className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">Cancel</button>
      <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Add Task</button>
    </div>
  </form>
</div>`,size:"large"};t.createRoot(document.getElementById("root")).render(e.jsx("div",{style:{padding:"20px",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",boxSizing:"border-box"},children:e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsx(o,{...n})})}));
