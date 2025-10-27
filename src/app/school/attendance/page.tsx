import AttendancePage from "@/components/school/pages/AttendancePage";
import { getSessions } from "@/server/actions/admin/getdata";
import { getAttendanceByDay } from "@/server/actions/school/attendance";
import { getPopulatedClasses } from "@/server/actions/school/getClasses";
import { redirect } from "next/navigation";
export interface FilteredStudentType {
  _id: string;
  class_id: string;
  name: string;
  fatherName: string;
  motherName: string;
  address: string;
  mobileNumber: number;
  adhaarNumber: number;
  serialNumber: number;
  rollnumber: string;
  image_url: string;
  image_public_id: string;
}
async function AttendancePageServer({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const sessions = await getSessions();

  if (sessions.sessions.length == 0)
    redirect("/school/sessions?message=Please create a session first");
  const populatedClasses = await getPopulatedClasses();

  if (populatedClasses.length == 0)
    redirect(
      "/school/classes?message=Please add classes to the current session"
    );
  const studentsByClass = populatedClasses!.reduce((acc, cls) => {
    acc[cls.class_name] = cls.students;
    return acc;
  }, {} as Record<string, FilteredStudentType[]>);
  const { date } = await searchParams;
  const attendance = (await getAttendanceByDay(date)) || [];
  return (
    <AttendancePage
      attendance={attendance}
      studentsByClass={studentsByClass}
      date={date}
    ></AttendancePage>
  );
}

export default AttendancePageServer;
