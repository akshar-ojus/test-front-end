import{r as l,j as e,R as d}from"./client-DDvZHYgl.js";function c({isOpen:o,onClose:i,title:n,children:t,size:a="medium"}){return l.useEffect(()=>(o?document.body.style.overflow="hidden":document.body.style.overflow="unset",()=>{document.body.style.overflow="unset"}),[o]),o?e.jsx("div",{className:"modal-overlay",onClick:i,children:e.jsxs("div",{className:`modal-content modal-${a}`,onClick:r=>r.stopPropagation(),children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h2",{children:n}),e.jsx("button",{className:"modal-close",onClick:i,children:"×"})]}),e.jsx("div",{className:"modal-body",children:t})]})}):null}const s=[],u=window.fetch;window.fetch=async(o,i)=>{console.log("[AI Frontend Previewer] Intercepting request to:",o);const n=s.find(t=>o.toString().includes(t.url_pattern)||t.url_pattern==="*")||s[0];return n?(console.log("[AI Frontend Previewer] Serving mock data:",n.response),await new Promise(t=>setTimeout(t,500)),{ok:!0,status:200,json:async()=>n.response,text:async()=>JSON.stringify(n.response)}):(console.warn("[AI Frontend Previewer] No mock found for:",o," - This might fail."),u(o,i))};const{children:p,...m}={isOpen:!0,onClose:"() => console.log('Modal closed')",title:"Create New Task",children:`
      <form class="task-form">
        <div class="form-group">
          <label for="task-name">Task Name</label>
          <input type="text" id="task-name" placeholder="e.g., Implement user authentication" value="Design new dashboard layout" />
        </div>
        <div class="form-group">
          <label for="task-description">Description</label>
          <textarea id="task-description" rows="4" placeholder="Detailed explanation of the task...">Create an engaging and informative dashboard for users to quickly see their progress.</textarea>
        </div>
        <div class="form-group">
          <label for="task-project">Project</label>
          <select id="task-project">
            <option value="">Select Project</option>
            <option value="project-1" selected>TaskHub Frontend</option>
            <option value="project-2">API Service Integration</option>
            <option value="project-3">Marketing Website</option>
          </select>
        </div>
        <div class="form-group">
          <label for="task-assignee">Assignee</label>
          <select id="task-assignee">
            <option value="">Unassigned</option>
            <option value="member-1" selected>Alice Smith</option>
            <option value="member-2">Bob Johnson</option>
            <option value="member-3">Charlie Brown</option>
          </select>
        </div>
        <div class="form-group">
          <label for="task-due-date">Due Date</label>
          <input type="date" id="task-due-date" value="2024-08-15" />
        </div>
        <div class="form-group">
          <label for="task-priority">Priority</label>
          <select id="task-priority">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="button primary">Create Task</button>
          <button type="button" class="button secondary">Cancel</button>
        </div>
      </form>
    `,size:"medium"};d.createRoot(document.getElementById("root")).render(e.jsx("div",{style:{padding:"20px",minHeight:"100vh",display:"flex",justifyContent:"center",alignItems:"center",boxSizing:"border-box"},children:e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsx(c,{...m,children:e.jsx("div",{dangerouslySetInnerHTML:{__html:p}})})})}));
