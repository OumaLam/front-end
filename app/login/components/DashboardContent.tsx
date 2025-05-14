// DashboardContent.jsx
export default function DashboardContent() {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Hamid Addach</span>
            <img src="/user-avatar.png" alt="User" className="w-10 h-10 rounded-full" />
          </div>
        </div>
  
        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          <Card title="Sales" value="67343" sub="+ 15.5% since last month" red={undefined} />
          <Card title="Purchases" value="2343" sub="- 5.6% since last month" red />
          <Card title="Orders" value="35343" sub="+ 2.3% since last month" />
        </div>
  
        {/* Second Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Overview</h3>
            <ul className="text-sm space-y-2">
              <li>📈 Member Profit - +2343</li>
              <li>📈 Member Profit - +1343</li>
              <li>📈 Member Profit - +2843</li>
              <li>📈 Member Profit - +2343</li>
            </ul>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-4">Total Sale</h3>
            <div className="text-2xl font-bold text-green-600">70%</div>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Activity</h3>
              <a href="#" className="text-sm text-green-600 font-medium">View All</a>
            </div>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>🟢 User X created a new account</li>
              <li>🔴 Server backup failed</li>
              <li>🟡 New admin request pending</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  function Card({ title, value, sub, red }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className={`text-sm mt-2 ${red ? "text-red-500" : "text-green-600"}`}>{sub}</p>
      </div>
    );
  }
  