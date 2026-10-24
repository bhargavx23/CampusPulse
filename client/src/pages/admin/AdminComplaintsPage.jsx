import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  SlidersHorizontal,
  ArrowUpDown,
  FileText,
  User,
  Shield,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input, Select, EmptyState } from '../../components/ui';
import { complaintService } from '../../services/complaintService';
import AdminComplaintModal from '../../components/admin/AdminComplaintModal';

const CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Departments / Categories' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Water Supply', label: 'Water Supply' },
  { value: 'Internet', label: 'Internet & WiFi' },
  { value: 'Classroom', label: 'Classroom & Labs' },
  { value: 'Hostel', label: 'Hostel & Residential' },
  { value: 'Cleanliness', label: 'Sanitation & Cleanliness' },
  { value: 'Other', label: 'Other Facilities' },
];

const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'Urgent', label: 'Urgent Only' },
  { value: 'High', label: 'High Priority' },
  { value: 'Medium', label: 'Medium Priority' },
  { value: 'Low', label: 'Low Priority' },
];

export function AdminComplaintsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [complaints, setComplaints] = useState([]);
  const [statusTab, setStatusTab] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync tab with URL search parameter
  useEffect(() => {
    const urlStatus = searchParams.get('status');
    if (urlStatus && urlStatus !== statusTab) {
      setStatusTab(urlStatus);
    }
  }, [searchParams]);

  useEffect(() => {
    loadComplaints();
  }, [statusTab, categoryFilter, priorityFilter, searchTerm, sortBy]);

  const loadComplaints = async () => {
    const list = complaintService.getComplaints({
      status: statusTab === 'all' ? undefined : statusTab,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
      search: searchTerm,
      sortBy,
    });
    setComplaints(list);

    await complaintService.fetchComplaints({
      status: statusTab === 'all' ? undefined : statusTab,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      priority: priorityFilter === 'all' ? undefined : priorityFilter,
      search: searchTerm,
    });

    setComplaints(
      complaintService.getComplaints({
        status: statusTab === 'all' ? undefined : statusTab,
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        priority: priorityFilter === 'all' ? undefined : priorityFilter,
        search: searchTerm,
        sortBy,
      })
    );
  };

  const handleTabChange = (status) => {
    setStatusTab(status);
    if (status === 'all') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  const handleOpenTriage = (complaint) => {
    setSelectedComplaint(complaint);
    setIsModalOpen(true);
  };

  const handleComplaintUpdated = () => {
    loadComplaints();
  };

  const stats = complaintService.getStats();

  const tabs = [
    { id: 'all', label: 'All Complaints', count: stats.total },
    { id: 'pending', label: 'Pending Triage', count: stats.pending },
    { id: 'in-progress', label: 'Active Dispatches', count: stats.inProgress },
    { id: 'resolved', label: 'Resolved Archive', count: stats.resolved },
    { id: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1E4EB]">
        <div>
          <h1 className="font-sora text-2xl font-bold text-[#202638]">
            Campus Grievance Operations Table
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#687084] mt-0.5">
            Institutional tracking, technician assignment, priority escalation, and resolution closure.
          </p>
        </div>
      </div>

      {/* 1. Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#E1E4EB]">
        {tabs.map((tab) => {
          const isActive = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150
                ${
                  isActive
                    ? 'bg-[#EEF0FF] text-[#4F46E5] shadow-xs'
                    : 'text-[#687084] hover:text-[#202638] hover:bg-white/80'
                }
              `}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-[#E1E4EB] text-[#687084]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search, Filters & Sorting Toolbar */}
      <Card className="border-[#E1E4EB] shadow-xs bg-white">
        <CardContent className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8B92A3] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ticket ID, headline, location, or student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#E1E4EB] bg-[#F0F1F5]/50 text-[#202638] placeholder-[#8B92A3] focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-4 focus:ring-indigo-500/10 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:flex items-center gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 text-xs rounded-xl border border-[#E1E4EB] bg-white px-3 text-[#202638] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              aria-label="Filter by department category"
            >
              {CATEGORY_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-10 text-xs rounded-xl border border-[#E1E4EB] bg-white px-3 text-[#202638] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer"
              aria-label="Filter by priority"
            >
              {PRIORITY_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 text-xs rounded-xl border border-[#E1E4EB] bg-white px-3 text-[#202638] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] cursor-pointer font-medium"
              aria-label="Sort complaints order"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="priority">Sort: Highest Priority</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 3. Complaints Table (Desktop) / Cards (Mobile) */}
      <Card className="border-[#E1E4EB] shadow-xs bg-white overflow-hidden">
        {complaints.length === 0 ? (
          <div className="p-12 text-center">
            <EmptyState
              icon={<FileText className="w-10 h-10 text-[#8B92A3]" />}
              title="No grievances match the filter criteria"
              description="Adjust your search query or status tab to view complaints across other departments."
            />
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-xs text-[#202638]">
                <thead className="bg-[#FAF9F6] border-b border-[#E1E4EB] text-[11px] font-bold uppercase tracking-wider text-[#687084]">
                  <tr>
                    <th className="py-3.5 px-5">Ticket ID</th>
                    <th className="py-3.5 px-4">Headline & Specific Location</th>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Department Assigned</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-5 text-right">Triage Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E1E4EB]">
                  {complaints.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-[#F0F1F5]/60 transition-colors duration-150 group"
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-[#4F46E5]">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="font-bold text-[#202638] leading-snug">{c.title}</p>
                        <p className="text-[11px] text-[#687084] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#8B92A3]" />
                          <span>{c.location}</span>
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#202638]">{c.studentName}</p>
                        <p className="text-[10px] text-[#8B92A3] font-mono">
                          {c.studentId || c.studentEmail}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-[#202638] leading-tight">
                          {c.assignedTo}
                        </p>
                        <p className="text-[10px] text-[#8B92A3] mt-0.5">
                          Category: {c.category}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={c.status} showDot>
                          {c.status === 'in-progress'
                            ? 'In Progress'
                            : c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={c.priority}>{c.priority}</Badge>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Button
                          type="button"
                          variant="primary"
                          size="xs"
                          onClick={() => handleOpenTriage(c)}
                          className="bg-[#4F46E5] hover:bg-indigo-700 shadow-xs font-semibold text-xs"
                        >
                          Triage & Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / Tablet Cards View */}
            <div className="lg:hidden divide-y divide-[#E1E4EB]">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-[#4F46E5]">
                      {c.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={c.status} showDot size="sm">
                        {c.status}
                      </Badge>
                      <Badge variant={c.priority} size="sm">
                        {c.priority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-sora text-sm font-bold text-[#202638]">
                      {c.title}
                    </h3>
                    <p className="text-xs text-[#687084] mt-0.5 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-[#687084]">
                    <span className="flex items-center gap-1 font-semibold text-[#202638]">
                      <User className="w-3 h-3 text-[#4F46E5]" />
                      {c.studentName}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#8B92A3]" />
                      {c.location}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-[#8B92A3]">
                      Assigned: {c.assignedTo}
                    </span>
                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      onClick={() => handleOpenTriage(c)}
                      className="bg-[#4F46E5] text-xs font-semibold"
                    >
                      Triage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Interactive Triage & Dispatch Modal */}
      <AdminComplaintModal
        complaint={selectedComplaint}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedComplaint(null);
        }}
        onUpdated={handleComplaintUpdated}
      />
    </div>
  );
}

export default AdminComplaintsPage;
