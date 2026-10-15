export type TeacherProfile = {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  regionalDirectorate: string;
};

export function toTeacherProfile(teacher: {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  regionalDirectorate: string;
}): TeacherProfile {
  return {
    id: teacher.id,
    fullName: teacher.fullName,
    email: teacher.email,
    schoolName: teacher.schoolName,
    regionalDirectorate: teacher.regionalDirectorate,
  };
}
