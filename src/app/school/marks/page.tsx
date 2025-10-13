import MarkspageSelector from "@/components/school/buttons/MarkspageSelector";
import MarksPage from "@/components/school/pages/Marks.page";
import { Card } from "@/components/ui/card";
import { getClasses } from "@/server/actions/school/getClasses";
import { getMarks } from "@/server/actions/school/marks";
import mongoose from "mongoose";
import { redirect } from "next/navigation";

export default async function MarksPageServer({
  searchParams,
}: {
  searchParams: Promise<{
    classname: string;
    subject: string;
    exam: string;
  }>;
}) {
  const classes = await getClasses();
  const params = await searchParams;
  console.log({ params });
  const resp = await getMarks(params);
  const currentClass = mongoose.Types.ObjectId.isValid(params.classname)
    ? params.classname
    : "";
  const currentSubject = mongoose.Types.ObjectId.isValid(params.subject)
    ? params.subject
    : "";
  console.log(classes.length);

  if (classes.length == 0) redirect("/school/classes");
  return (
    <div className="p-2 md:p-6 space-y-6 overflow-y-auto">
      <div className="sm:flex items-center justify-between hidden">
        <div>
          <h3>Add/View Marks</h3>
          <p className="text-muted-foreground">
            Enter and edit marks for different exams and view marks per class
          </p>
        </div>
      </div>
      <Card className="rounded-xl">
        <MarkspageSelector
          currentSubject={currentSubject}
          classes={classes}
          currentClass={currentClass}
        />
        <MarksPage marks={resp.marks} />
      </Card>
    </div>
  );
}
