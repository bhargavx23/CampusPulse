import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  AlertCircle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  EmptyState,
} from '../../components/ui';

export function StudentComplaintsPage() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    'All Categories',
    'Infrastructure',
    'Electricity',
    'Water Supply',
    'Internet',
    'Classroom',
    'Hostel',
    'Cleanliness',
    'Other',
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  useEffect(() => {
    if (user?.email) {
      loadComplaints();
    }
  }, [user, searchTerm, statusFilter, categoryFilter, sortBy]);

  const loadComplaints = async () => {
    const data = complaintService.getComplaints({
      studentEmail: user?.email,
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter === 'All Categories' ? 'all' : categoryFilter,
      sortBy,
    });
    setComplaints(data);
    setCurrentPage(1); // reset to page 1 on filter change

    await complaintService.fetchComplaints({
      search: searchTerm,
      status: statusFilter,
      category: categoryFilter === 'All Categories' ? 'all' : categoryFilter,
    });

    setComplaints(
      complaintService.getComplaints({
        studentEmail: user?.email,
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter === 'All Categories' ? 'all' : categoryFilter,
        sortBy,
      })
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'resolved') return <Badge variant="resolved" showDot>Resolved</Badge>;
    if (s === 'in-progress') return <Badge variant="in-progress" showDot>In Progress</Badge>;
    if (s === 'rejected') return <Badge variant="rejected" showDot>Rejected</Badge>;
    return <Badge variant="pending" showDot>Pending</Badge>;
  };

  // Pagination calculation
  const totalPages = Math.ceil(complaints.length / itemsPerPage) || 1;
  const paginatedComplaints = complaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-workspace-border">
        <div>
          <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
            My Complaints
          </h2>
          <p className="font-sans text-sm text-workspace-textSecondary mt-0.5">
            Review your complete record of filed grievances and track live progress.
          </p>
        </div>

        <Link to="/student/complaints/new">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            className="bg-primary-600 hover:bg-primary-700 shadow-sm"
          >
            File New Issue
          </Button>
        </Link>
      </div>

      {/* Filter and Search Controls Bar */}
      <Card className="border-workspace-border shadow-soft">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by ID, keyword, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs sm:text-sm pl-9 pr-3.5 py-2 rounded-xl border border-workspace-border bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Status Select */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-workspace-border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                aria-label="Filter by status"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-workspace-border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                aria-label="Filter by category"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-workspace-border bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                aria-label="Sort complaints"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="priority">Sort: By Priority</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'All Categories') && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Active filters:</span>
              {searchTerm && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  Search: "{searchTerm}"
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 capitalize">
                  Status: {statusFilter}
                </span>
              )}
              {categoryFilter !== 'All Categories' && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  Category: {categoryFilter}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('All Categories');
                }}
                className="text-primary-600 hover:text-primary-700 font-semibold underline ml-1"
              >
                Reset filters
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Complaints List / Table */}
      <Card className="border-workspace-border shadow-soft">
        <CardContent className="p-0">
          {paginatedComplaints.length === 0 ? (
            <div className="p-8 sm:p-12">
              <EmptyState
                icon={<FileText className="w-8 h-8 text-slate-400" />}
                title="No complaints match your criteria"
                description="Try adjusting your search terms or filter selections to view registered complaints."
                action={
                  <Link to="/student/complaints/new">
                    <Button variant="primary" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                      Create Complaint
                    </Button>
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-slate-50/80 text-[11px] font-semibold text-workspace-textMuted uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Tracking ID</th>
                      <th className="py-3.5 px-6">Issue Summary</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Filed Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedComplaints.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        <td className="py-4 px-6 font-mono font-semibold text-xs text-primary-700 whitespace-nowrap">
                          #{item.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-md">
                            <Link
                              to={`/student/complaints/${item.id}`}
                              className="font-manrope font-semibold text-workspace-textPrimary group-hover:text-primary-600 transition-colors line-clamp-1 block"
                            >
                              {item.title}
                            </Link>
                            <span className="text-xs text-workspace-textMuted line-clamp-1">
                              {item.location}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-xs font-semibold">
                          <span
                            className={`
                              ${item.priority === 'Urgent' ? 'text-rose-600' : ''}
                              ${item.priority === 'High' ? 'text-amber-600' : ''}
                              ${item.priority === 'Medium' ? 'text-primary-600' : ''}
                              ${item.priority === 'Low' ? 'text-slate-500' : ''}
                            `}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <Link to={`/student/complaints/${item.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden divide-y divide-slate-100">
                {paginatedComplaints.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary-700">
                          #{item.id}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {item.priority}
                        </span>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <div>
                      <Link
                        to={`/student/complaints/${item.id}`}
                        className="font-manrope font-semibold text-sm text-workspace-textPrimary"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                      <span>{item.location} · {formatDate(item.createdAt)}</span>
                      <Link to={`/student/complaints/${item.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, complaints.length)} of{' '}
                {complaints.length} complaints
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-8 px-2.5"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-8 px-2.5"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentComplaintsPage;
