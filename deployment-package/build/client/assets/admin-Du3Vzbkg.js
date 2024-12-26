import{u as l,a as n,j as e,F as a}from"./components-BUtF2obd.js";function m(){const{users:s}=l(),r=n();return e.jsx("div",{className:"min-h-screen bg-bolt-elements-background-depth-1 p-8",children:e.jsxs("div",{className:"max-w-4xl mx-auto",children:[e.jsxs("div",{className:"bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg mb-8",children:[e.jsx("h2",{className:"text-xl font-semibold text-bolt-elements-textPrimary mb-4",children:"Current User Status"}),e.jsxs("p",{className:"text-bolt-elements-textSecondary",children:["You are logged in as ",e.jsx("span",{className:"text-bolt-elements-textPrimary font-semibold",children:s.find(t=>t.isAdmin)?.username}),s.find(t=>t.isAdmin)?.isAdmin?" (Admin)":" (Regular User)"]})]}),e.jsx("h1",{className:"text-3xl font-bold text-bolt-elements-textPrimary mb-8",children:"User Management"}),e.jsxs("div",{className:"bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg mb-8",children:[e.jsx("h2",{className:"text-xl font-semibold text-bolt-elements-textPrimary mb-4",children:"Create New User"}),e.jsxs(a,{method:"post",className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"username",className:"block text-sm font-medium text-bolt-elements-textPrimary",children:"Username"}),e.jsx("input",{type:"text",id:"username",name:"username",required:!0,className:"mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus"})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"password",className:"block text-sm font-medium text-bolt-elements-textPrimary",children:"Password"}),e.jsx("input",{type:"password",id:"password",name:"password",required:!0,className:"mt-1 block w-full rounded-md border-0 bg-bolt-elements-background-depth-2 py-2 px-3 text-bolt-elements-textPrimary shadow-sm ring-1 ring-inset ring-bolt-elements-borderColor/50 focus:ring-2 focus:ring-inset focus:ring-bolt-elements-focus"})]}),e.jsxs("div",{className:"flex items-center",children:[e.jsx("input",{type:"checkbox",id:"isAdmin",name:"isAdmin",value:"true",className:"h-4 w-4 rounded border-bolt-elements-borderColor text-bolt-elements-focus focus:ring-bolt-elements-focus"}),e.jsx("label",{htmlFor:"isAdmin",className:"ml-2 block text-sm text-bolt-elements-textPrimary",children:"Admin User"})]}),r&&"error"in r&&e.jsx("div",{className:"text-red-500 text-sm",children:r.error}),e.jsx("button",{type:"submit",className:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bolt-elements-focus",children:"Create User"})]})]}),e.jsxs("div",{className:"bg-bolt-elements-background-depth-3 p-6 rounded-lg shadow-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-bolt-elements-textPrimary mb-4",children:"Users"}),e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"min-w-full divide-y divide-bolt-elements-borderColor",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider",children:"Username"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider",children:"Role"}),e.jsx("th",{className:"px-6 py-3 text-left text-xs font-medium text-bolt-elements-textSecondary uppercase tracking-wider",children:"Created At"})]})}),e.jsx("tbody",{className:"divide-y divide-bolt-elements-borderColor",children:s.map(t=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary",children:t.username}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary",children:t.isAdmin?"Admin":"User"}),e.jsx("td",{className:"px-6 py-4 whitespace-nowrap text-sm text-bolt-elements-textPrimary",children:new Date(t.createdAt).toLocaleDateString()})]},t.id))})]})})]})]})})}export{m as default};
