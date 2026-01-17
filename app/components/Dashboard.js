'use client';

import { useEffect, useRef } from 'react';

export default function Dashboard({ data, onRefresh, loading, lastRefresh }) {
  const canvasRefs = {
    enrolment: useRef(null),
    states: useRef(null),
    ageGroups: useRef(null),
    updateTypes: useRef(null),
  };

  useEffect(() => {
    if (!data) return;

    // Draw Enrolment Trend Chart
    drawEnrolmentChart();
    // Draw State Updates Chart
    drawStatesChart();
    // Draw Age Groups Chart
    drawAgeGroupsChart();
    // Draw Update Types Chart
    drawUpdateTypesChart();
  }, [data]);

  const drawEnrolmentChart = () => {
    const canvas = canvasRefs.enrolment.current;
    if (!canvas || !data?.enrolments) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const enrolments = data.enrolments;
    const maxValue = Math.max(...enrolments.map(e => e.total));
    const minValue = Math.min(...enrolments.map(e => e.total));
    const valueRange = maxValue - minValue;

    // Draw axes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw grid lines and Y-axis labels
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = height - padding - (i * (height - 2 * padding) / ySteps);
      const value = minValue + (i * valueRange / ySteps);
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      ctx.fillText((value / 1000000000).toFixed(2) + 'B', padding - 10, y + 4);
    }

    // Draw line chart
    const stepX = (width - 2 * padding) / (enrolments.length - 1);
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    enrolments.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((item.total - minValue) / valueRange) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#3b82f6';
    enrolments.forEach((item, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((item.total - minValue) / valueRange) * (height - 2 * padding);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw X-axis labels
    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    enrolments.forEach((item, index) => {
      const x = padding + index * stepX;
      ctx.fillText(item.year, x, height - padding + 20);
    });

    // Chart title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Year-wise Aadhaar Enrolments', width / 2, 30);
  };

  const drawStatesChart = () => {
    const canvas = canvasRefs.states.current;
    if (!canvas || !data?.stateUpdates) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const leftPadding = 150;

    ctx.clearRect(0, 0, width, height);

    const states = data.stateUpdates.slice(0, 10); // Top 10 states
    const maxValue = Math.max(...states.map(s => s.updates));
    const barHeight = (height - 2 * padding) / states.length - 10;

    // Chart title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Top States by Updates', width / 2, 25);

    states.forEach((item, index) => {
      const y = padding + index * (barHeight + 10);
      const barWidth = ((width - leftPadding - padding) * item.updates) / maxValue;

      // Draw bar
      const gradient = ctx.createLinearGradient(leftPadding, 0, leftPadding + barWidth, 0);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#6366f1');
      ctx.fillStyle = gradient;
      ctx.fillRect(leftPadding, y, barWidth, barHeight);

      // State name
      ctx.fillStyle = '#1e293b';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(item.state, leftPadding - 10, y + barHeight / 2 + 4);

      // Value
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'left';
      ctx.fillText((item.updates / 1000000).toFixed(1) + 'M', leftPadding + 10, y + barHeight / 2 + 4);
    });
  };

  const drawAgeGroupsChart = () => {
    const canvas = canvasRefs.ageGroups.current;
    if (!canvas || !data?.ageGroups) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;

    ctx.clearRect(0, 0, width, height);

    const ageGroups = data.ageGroups;
    const total = ageGroups.reduce((sum, item) => sum + item.count, 0);
    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    let currentAngle = -Math.PI / 2;

    // Chart title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Age Group Distribution', centerX, 25);

    ageGroups.forEach((item, index) => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;

      // Draw slice
      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.group, labelX, labelY);
      ctx.font = '11px sans-serif';
      ctx.fillText((item.count / 1000000).toFixed(0) + 'M', labelX, labelY + 15);

      currentAngle += sliceAngle;
    });

    // Draw legend
    const legendX = 20;
    let legendY = height - 120;
    
    ageGroups.forEach((item, index) => {
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(legendX, legendY, 15, 15);
      
      ctx.fillStyle = '#1e293b';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.group}: ${((item.count / total) * 100).toFixed(1)}%`, legendX + 25, legendY + 12);
      
      legendY += 20;
    });
  };

  const drawUpdateTypesChart = () => {
    const canvas = canvasRefs.updateTypes.current;
    if (!canvas || !data?.updateTypes) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const bottomPadding = 100;

    ctx.clearRect(0, 0, width, height);

    const updateTypes = data.updateTypes;
    const maxValue = Math.max(...updateTypes.map(u => u.count));
    const barWidth = (width - 2 * padding) / updateTypes.length - 20;

    // Chart title
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Update Types Distribution', width / 2, 30);

    const colors = ['#06b6d4', '#14b8a6', '#10b981', '#84cc16', '#eab308'];

    updateTypes.forEach((item, index) => {
      const x = padding + index * (barWidth + 20) + 10;
      const barHeightValue = ((height - padding - bottomPadding) * item.count) / maxValue;
      const y = height - bottomPadding - barHeightValue;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - bottomPadding);
      gradient.addColorStop(0, colors[index % colors.length]);
      gradient.addColorStop(1, colors[index % colors.length] + '80');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeightValue);

      // Draw value on top
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText((item.count / 1000000).toFixed(1) + 'M', x + barWidth / 2, y - 8);

      // Draw label (rotated)
      ctx.save();
      ctx.translate(x + barWidth / 2, height - bottomPadding + 20);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.type, 0, 0);
      ctx.restore();
    });

    // Y-axis
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - bottomPadding);
    ctx.lineTo(width - padding, height - bottomPadding);
    ctx.stroke();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Aadhaar Trends Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Aggregated Statistics & Insights
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg 
                    className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
                {data?.lastUpdated && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Data Updated: <span className="font-semibold">{data.lastUpdated}</span>
                  </div>
                )}
                {lastRefresh && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Last Refresh: {formatDate(lastRefresh)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Ethics Notice */}
        <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                Data Privacy & Transparency Notice
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This dashboard automatically refreshes publicly released, aggregated Aadhaar statistics. 
                No real-time or personal Aadhaar data is accessed. All data represents anonymized, 
                aggregated statistics released periodically by UIDAI.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Total Enrolments (Latest)
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data?.enrolments && (data.enrolments[data.enrolments.length - 1].total / 1000000000).toFixed(2)}B
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              As of {data?.enrolments && data.enrolments[data.enrolments.length - 1].year}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Total State Updates
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data?.stateUpdates && (data.stateUpdates.reduce((sum, s) => sum + s.updates, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Across {data?.stateUpdates?.length} states
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Total Updates
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data?.updateTypes && (data.updateTypes.reduce((sum, u) => sum + u.count, 0) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Various update types
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Auto-Refresh Status
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">
                Active
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Refreshes every 5 minutes
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrolment Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <canvas 
              ref={canvasRefs.enrolment} 
              width={600} 
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* State Updates Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <canvas 
              ref={canvasRefs.states} 
              width={600} 
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* Age Groups Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <canvas 
              ref={canvasRefs.ageGroups} 
              width={600} 
              height={400}
              className="w-full h-auto"
            />
          </div>

          {/* Update Types Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <canvas 
              ref={canvasRefs.updateTypes} 
              width={600} 
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Dashboard automatically refreshes data every 5 minutes | 
            Data source: {data?.metadata?.source || 'UIDAI'} | 
            Update Frequency: {data?.metadata?.updateFrequency || 'Monthly'}
          </p>
        </footer>
      </div>
    </div>
  );
}
