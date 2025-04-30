
interface AnalyticsData {
  totalPrompts: number;
  totalRequests: number;
}

const AnalyticsDashboard = ({ analyticsData }: { analyticsData: AnalyticsData }) => {
    return (
      <div className="p-2">
        <h2 className="text-xl font-bold mb-2">Analytics</h2>
        <p className="text-gray-700">Total Prompts: {analyticsData.totalPrompts}</p>
        <p className="text-gray-700">Total Requests: {analyticsData.totalRequests}</p>
        {/* Expand with charts, usage graphs, etc. */}
      </div>
    );
  };
  
  export default AnalyticsDashboard;