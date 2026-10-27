import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Phone,
  Shield,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
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
  Input,
  ErrorMessage,
  Badge,
} from '../../components/ui';

export function StudentProfilePage() {
  const { user, updateProfile } = useAuth();

  const [phone, setPhone] = useState(user?.phone || '');
  const [hostelBlock, setHostelBlock] = useState(user?.hostelBlock || '');
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const stats = user?.email ? complaintService.getStats(user.email) : { total: 0, resolved: 0 };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      updateProfile({
        phone: phone.trim(),
        hostelBlock: hostelBlock.trim(),
        roomNumber: roomNumber.trim(),
        emergencyContact: emergencyContact.trim(),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-workspace-border">
        <h2 className="font-sora text-2xl font-bold text-workspace-textPrimary">
          Student Profile & Identity
        </h2>
        <p className="font-sans text-sm text-workspace-textSecondary mt-0.5">
          View official institutional records and update your primary residential contact details.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Student Identity Card & Activity (1 Col) */}
        <div className="space-y-6">
          <Card className="border-workspace-border shadow-soft text-center p-6 bg-white">
            <div className="w-20 h-20 rounded-2xl bg-[#EAF1F4] text-[#48677A] font-bold text-2xl flex items-center justify-center mx-auto border-2 border-primary-200 shadow-sm mb-4">
              {user?.name ? user.name.charAt(0) : 'S'}
            </div>
            <h3 className="font-sora text-lg font-bold text-[#202B33]">
              {user?.name}
            </h3>
            <p className="font-mono text-xs text-[#48677A] font-semibold mt-0.5">
              Roll No: {user?.rollNumber || user?.studentId}
            </p>
            <p className="text-xs text-[#5D6B73] mt-1">{user?.email}</p>

            <div className="mt-4 pt-4 border-t border-[#E3E8E6] flex items-center justify-center gap-2">
              <Badge variant="resolved" showDot>
                {user?.role === 'admin' ? 'Campus Administrator' : 'Verified Enrolled Student'}
              </Badge>
            </div>
          </Card>

          {/* Quick Metrics */}
          <Card className="border-workspace-border shadow-soft p-5 space-y-3 bg-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#87939A] block">
              Grievance Activity
            </span>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5D6B73]">Complaints Filed:</span>
              <span className="font-bold text-[#202B33]">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5D6B73]">Successfully Resolved:</span>
              <span className="font-bold text-[#287C78]">{stats.resolved}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#5D6B73]">Account Enrolled:</span>
              <span className="text-[#5D6B73]">{user?.enrolledAt || '2026'}</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Academic Details & Editable Contact Info (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Read-Only Academic Record */}
          <Card className="border-workspace-border shadow-soft bg-white">
            <CardHeader>
              <div>
                <CardTitle className="text-base font-semibold text-[#202B33]">Institutional Academic Record</CardTitle>
                <CardDescription>Verified academic details provisioned upon registration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1">
                <span className="text-[#87939A] text-[10px] font-semibold uppercase tracking-wider block">
                  Branch / Department
                </span>
                <p className="font-semibold text-[#202B33] text-sm">
                  {user?.branch || user?.department || 'CSE — Computer Science and Engineering'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1">
                <span className="text-[#87939A] text-[10px] font-semibold uppercase tracking-wider block">
                  Year of Study
                </span>
                <p className="font-semibold text-[#202B33] text-sm">
                  {user?.yearOfStudy || user?.academicYear || '3rd Year'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1">
                <span className="text-[#87939A] text-[10px] font-semibold uppercase tracking-wider block">
                  Class Section
                </span>
                <p className="font-semibold text-[#202B33] text-sm">
                  Section {user?.section || 'A'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1">
                <span className="text-[#87939A] text-[10px] font-semibold uppercase tracking-wider block">
                  College Roll Number
                </span>
                <p className="font-semibold text-[#48677A] text-sm font-mono">
                  {user?.rollNumber || user?.studentId || 'STU-2024-8842'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#EEF1EF] border border-[#E3E8E6] space-y-1 sm:col-span-2">
                <span className="text-[#87939A] text-[10px] font-semibold uppercase tracking-wider block">
                  Degree / Program
                </span>
                <p className="font-semibold text-[#202B33] text-sm">
                  {user?.course || 'Bachelor of Technology (B.Tech)'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Editable Residential / Contact Preferences */}
          <Card className="border-workspace-border shadow-soft">
            <CardHeader>
              <div>
                <CardTitle className="text-base font-semibold">Contact & Campus Residence</CardTitle>
                <CardDescription>Used for technician dispatch access and service notifications</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="profile-phone"
                    label="Mobile Contact"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftIcon={<Phone className="w-4 h-4" />}
                  />

                  <Input
                    id="profile-emergency"
                    label="Emergency Contact"
                    placeholder="Parent / Guardian Name & Phone"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    leftIcon={<Shield className="w-4 h-4" />}
                  />

                  <Input
                    id="profile-block"
                    label="Hostel Block / Building"
                    placeholder="Hostel Block C"
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    leftIcon={<Building className="w-4 h-4" />}
                  />

                  <Input
                    id="profile-room"
                    label="Room / Unit Number"
                    placeholder="Room 304"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    leftIcon={<Building className="w-4 h-4" />}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                    className="bg-primary-600 hover:bg-primary-700 shadow-sm"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StudentProfilePage;
