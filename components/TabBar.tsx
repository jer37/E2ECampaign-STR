interface TabBarProps {
  activeTab: 'active' | 'schedule' | 'goals';
  onTabChange: (tab: 'active' | 'schedule' | 'goals') => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="border-b border-[rgba(0,0,0,0.1)]">
      <div className="px-8 flex gap-8">
        <button
          onClick={() => onTabChange('active')}
          className={`relative py-4 text-base font-semibold tracking-tight transition-colors ${
            activeTab === 'active'
              ? 'text-[#4c65f0]'
              : 'text-[rgba(0,0,0,0.65)] hover:text-black'
          }`}
        >
          Active
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4c65f0] rounded-t-full animate-slide-in" />
          )}
        </button>

        <button
          onClick={() => onTabChange('schedule')}
          className={`relative py-4 text-base font-semibold tracking-tight transition-colors ${
            activeTab === 'schedule'
              ? 'text-[#4c65f0]'
              : 'text-[rgba(0,0,0,0.65)] hover:text-black'
          }`}
        >
          Game Opportunities
          {activeTab === 'schedule' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4c65f0] rounded-t-full animate-slide-in" />
          )}
        </button>

        <button
          onClick={() => onTabChange('goals')}
          className={`relative py-4 text-base font-semibold tracking-tight transition-colors ${
            activeTab === 'goals'
              ? 'text-[#4c65f0]'
              : 'text-[rgba(0,0,0,0.65)] hover:text-black'
          }`}
        >
          Season Opportunities
          {activeTab === 'goals' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4c65f0] rounded-t-full animate-slide-in" />
          )}
        </button>
      </div>
    </div>
  );
}
