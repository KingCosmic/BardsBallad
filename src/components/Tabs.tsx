import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  Content: React.FC;
}

const DefaultComp = () => <p>No tab found for this id.</p>

const Tabs: React.FC<{ tabs: Tab[], props: any }> = ({ tabs, props }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full mt-5">
      <div className="flex space-x-2 border-b border-neutral-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
            }}
            className={`py-2 px-4 text-sm font-medium transition-colors border-fantasy-accent ${
              activeTab === tab.id
                ? "border-b-2 text-fantasy-accent"
                : "text-fantasy-text-muted hover:text-fantasy-accent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {tabs.find((tab) => tab.id === activeTab)?.Content(props) || <DefaultComp />}
      </div>
    </div>
  );
}

export default Tabs;