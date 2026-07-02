import React from 'react';
import { Button } from '../../../components/ui/Button';
import { useAnalytics } from '../hooks/useAnalytics';

export function ReportExport({ data }: { data: any }) {
  const { generateReport } = useAnalytics('', '', ''); // We'll pass the actual userID from parent

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      const result = await generateReport(format);
      if (result?.reportUrl) {
        window.open(result.reportUrl, '_blank');
      }
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={() => handleExport('pdf')}>
        PDF
      </Button>
      <Button variant="secondary" size="sm" onClick={() => handleExport('csv')}>
        CSV
      </Button>
    </div>
  );
}