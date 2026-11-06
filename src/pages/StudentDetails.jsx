import { useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import useResource from '../hooks/useResource';
import { studentService } from '../services/studentService';
import { PageHeader, Panel } from './PageSupport';
import { StudentForm } from './Students';
import { ResourceState } from './LiveSupport';
export default function StudentDetails({ studentId }) {
  const { user } = useAuth(); const load = useCallback(signal => studentService.get(studentId, { signal }), [studentId]); const resource = useResource(load);
  if (!studentId) return <p>Choose a student from the directory.</p>;
  return <ResourceState resource={resource}>{student => <><PageHeader title={student.name} description={`Student code: ${student.student_code}`} /><Panel title="Student profile"><dl className="live-details">{['age','department','academic_year','institution'].map(field => <div key={field}><dt>{field.replaceAll('_',' ')}</dt><dd>{student[field]}</dd></div>)}</dl><a href={`#/screenings?studentId=${student.id}`}>View screenings</a>{user.role === 'screening_personnel' && <p className="mt-4"><a href={`#/screenings/new?studentId=${student.id}`}>New screening</a></p>}</Panel>{user.role === 'screening_personnel' && <Panel title="Edit profile"><StudentForm key={student.id + student.name + student.age + student.department + student.academic_year + student.institution} student={student} onDone={resource.reload} /></Panel>}</>}</ResourceState>;
}
