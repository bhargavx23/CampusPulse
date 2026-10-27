import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  GraduationCap,
  Mail,
  Hash,
  Layers,
  ArrowRight,
  FileText,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Input, EmptyState } from '../../components/ui';
import { userService } from '../../services/userService';
import { complaintService } from '../../services/complaintService';

export function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      const list = await userService.getStudents();
      setStudents(list);
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3E8E6]">
        <div>
          <h1 className="font-sora text-2xl font-bold text-[#202B33]">
            Registered Students Directory
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#5D6B73] mt-0.5">
            Verified institutional student enrollments, academic records, and grievance filing activity.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#E3E8E6] text-xs font-semibold text-[#202B33] shadow-xs">
          <Users className="w-4 h-4 text-[#48677A]" />
          <span>{students.length} Verified Student Records</span>
        </div>
      </div>

      {/* Search Toolbar */}
      <Card className="border-[#E3E8E6] shadow-xs bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#87939A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student by full name, roll number, department, or institutional email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#E3E8E6] bg-[#EEF1EF]/50 text-[#202B33] placeholder-[#87939A] focus:outline-none focus:bg-white focus:border-[#48677A] focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>
        </CardContent>
      </Card>

      {/* Students Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={<Users className="w-10 h-10 text-[#87939A]" />}
              title="No student records match search criteria"
              description="Check your search query or verify if the student registered using the official portal."
            />
          </div>
        ) : (
          filteredStudents.map((s) => {
            const stats = complaintService.getStats(s.email);
            return (
              <Card
                key={s.id || s.email}
                className="border-[#E3E8E6] shadow-xs bg-white hover:border-[#D2DAD6] hover:shadow-card transition-all duration-200"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#EAF1F4] text-[#48677A] font-bold text-sm flex items-center justify-center border border-primary-100 shadow-xs">
                        {s.name ? s.name.charAt(0) : 'S'}
                      </div>
                      <div>
                        <h3 className="font-sora text-sm font-bold text-[#202B33] leading-tight">
                          {s.name}
                        </h3>
                        <p className="font-mono text-xs font-semibold text-[#48677A] mt-0.5">
                          {s.rollNumber || s.studentId || 'UNASSIGNED'}
                        </p>
                      </div>
                    </div>

                    <Badge variant="resolved" size="sm">
                      Enrolled
                    </Badge>
                  </div>

                  {/* Academic Details List */}
                  <div className="p-3 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[#5D6B73]">
                      <span className="text-[11px]">Branch:</span>
                      <span className="font-semibold text-[#202B33] truncate max-w-[180px]">
                        {s.branch || s.department || 'Computer Engineering'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#5D6B73]">
                      <span className="text-[11px]">Year & Section:</span>
                      <span className="font-semibold text-[#202B33]">
                        {s.yearOfStudy || '3rd Year'} • Section {s.section || 'A'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[#5D6B73]">
                      <span className="text-[11px]">Email:</span>
                      <span className="text-[#202B33] truncate max-w-[180px]">
                        {s.email}
                      </span>
                    </div>
                  </div>

                  {/* Grievance Activity Footer */}
                  <div className="pt-2 border-t border-[#E3E8E6] flex items-center justify-between text-xs">
                    <span className="text-[#5D6B73]">
                      Complaints Filed: <strong className="text-[#202B33]">{stats.total}</strong>
                    </span>
                    <Link
                      to={`/admin/complaints?search=${encodeURIComponent(s.name)}`}
                      className="text-xs font-semibold text-[#48677A] hover:text-primary-700 flex items-center gap-1"
                    >
                      <span>Track Tickets</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminStudentsPage;
