import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

/**
 * Returns registered students directory for administrators with academic details and grievance counts
 */
export async function getAllStudents(req, res) {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });

    const studentList = await Promise.all(
      students.map(async (student) => {
        const studentJson = student.toJSON();
        const complaintCount = await Complaint.countDocuments({ student: student._id });
        return {
          ...studentJson,
          complaintCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: studentList.length,
      students: studentList,
    });
  } catch (error) {
    console.error('getAllStudents error:', error);
    return res.status(500).json({ success: false, error: 'Server error retrieving students directory.' });
  }
}

export default { getAllStudents };
