import React from "react";

function Sidebar({ isOpen, activeTab, setActiveTab, sidebarItems, toggleSidebar }) {
  return (
    <div className={`${isOpen ? "w-64" : "w-20"} bg-card dark:bg-dark-card transition-all duration-300 p-4 border-r border-border dark:border-dark-border`}>
      <div className="flex items-center justify-between mb-8">
       
        <button
          onClick={toggleSidebar}
          className="text-accent dark:text-dark-accent p-2 rounded-lg hover:bg-secondary dark:hover:bg-dark-secondary"
        >
          ≡
        </button>
      </div>
      <nav>
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center p-3 mb-2 rounded-lg ${activeTab === item.id ? "bg-primary text-primary-foreground" : "text-accent hover:bg-secondary dark:hover:bg-dark-secondary"}`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="ml-3">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;