import { useState, useCallback, useEffect, useMemo } from 'react';
import reportService from '@/services/reportService';
import type {
  ReportSummary,
  DateRangePreset,
  ReportFilterParams,
} from '@/types/report';
import { parseApiError } from '@/services/api';
import { useDebounce } from './useDebounce';
import { useToast } from './useToast';

export function getDateRangeFromPreset(preset: DateRangePreset, customStart?: string, customEnd?: string) {
  const today = new Date();
  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  switch (preset) {
    case 'TODAY':
      return { startDate: formatDate(today), endDate: formatDate(today) };
    case 'YESTERDAY': {
      const y = new Date(today);
      y.setDate(today.getDate() - 1);
      return { startDate: formatDate(y), endDate: formatDate(y) };
    }
    case 'LAST_7_DAYS': {
      const d7 = new Date(today);
      d7.setDate(today.getDate() - 6);
      return { startDate: formatDate(d7), endDate: formatDate(today) };
    }
    case 'LAST_30_DAYS': {
      const d30 = new Date(today);
      d30.setDate(today.getDate() - 29);
      return { startDate: formatDate(d30), endDate: formatDate(today) };
    }
    case 'LAST_90_DAYS': {
      const d90 = new Date(today);
      d90.setDate(today.getDate() - 89);
      return { startDate: formatDate(d90), endDate: formatDate(today) };
    }
    case 'THIS_MONTH': {
      const tmStart = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: formatDate(tmStart), endDate: formatDate(today) };
    }
    case 'LAST_MONTH': {
      const lmStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lmEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate: formatDate(lmStart), endDate: formatDate(lmEnd) };
    }
    case 'THIS_YEAR': {
      const tyStart = new Date(today.getFullYear(), 0, 1);
      return { startDate: formatDate(tyStart), endDate: formatDate(today) };
    }
    case 'CUSTOM':
    default:
      return {
        startDate: customStart || formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        endDate: customEnd || formatDate(today),
      };
  }
}

export const useReports = () => {
  const [preset, setPreset] = useState<DateRangePreset>('THIS_MONTH');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const toast = useToast();

  const activeDates = useMemo(
    () => getDateRangeFromPreset(preset, customStart, customEnd),
    [preset, customStart, customEnd]
  );

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: ReportFilterParams = {
        preset,
        startDate: activeDates.startDate,
        endDate: activeDates.endDate,
        search: debouncedSearch,
        category: categoryFilter,
      };
      const data = await reportService.getReportDashboard(params);
      setSummary(data);
    } catch (err: unknown) {
      const msg = parseApiError(err);
      setError(msg);
      toast.error('Failed to load report analytics.');
    } finally {
      setIsLoading(false);
    }
  }, [preset, activeDates, debouncedSearch, categoryFilter, toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleExport = useCallback(
    async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
      setIsExporting(true);
      try {
        const params: ReportFilterParams = {
          preset,
          startDate: activeDates.startDate,
          endDate: activeDates.endDate,
          search: debouncedSearch,
          category: categoryFilter,
        };
        const blob = await reportService.exportReport(params, format);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `TrackWise_Report_${activeDates.startDate}_to_${activeDates.endDate}.${
          format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'
        }`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Report exported successfully as ${format.toUpperCase()}!`);
      } catch (err: unknown) {
        const msg = parseApiError(err);
        toast.error(`Export failed: ${msg}`);
      } finally {
        setIsExporting(false);
      }
    },
    [preset, activeDates, debouncedSearch, categoryFilter, toast]
  );

  const resetFilters = useCallback(() => {
    setPreset('THIS_MONTH');
    setCustomStart('');
    setCustomEnd('');
    setSearchQuery('');
    setCategoryFilter('ALL');
  }, []);

  return {
    summary,
    isLoading,
    isExporting,
    error,

    // Filter states
    preset,
    setPreset,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeDates,
    resetFilters,

    // Actions
    refetch: fetchReports,
    exportReport: handleExport,
  };
};

export default useReports;
