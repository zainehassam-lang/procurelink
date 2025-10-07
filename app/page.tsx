export default function Page() {
  return (
    <div className="min-h-screen w-full bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-red-600 grid place-content-center font-bold text-lg">
              PL
            </div>
            <div>
              <h1 className="text-3xl font-bold">ProcureLink</h1>
              <p className="text-sm text-gray-400">
                Direct & Indirect procurement collaboration
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600 rounded-lg font-medium">
            + Quick Add
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['Overview','Suppliers','RFQs','Evals','Risks','Performance','Contracts','Settings']
            .map(tab => (
              <button
                key={tab}
                className="px-4 py-2 rounded-md bg-gray-800 hover:bg-red-600 hover:text-white"
              >
                {tab}
              </button>
          ))}
        </div>

        {/* Overview Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="p-5 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Direct</h2>
            <p>Approved suppliers: 2</p>
            <p>Open RFQs: 1</p>
          </div>
          <div className="p-5 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Indirect</h2>
            <p>Approved suppliers: 0</p>
            <p>Open RFQs: 0</p>
          </div>
          <div className="p-5 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">SLA Trend</h2>
            <p>Coming soon...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
