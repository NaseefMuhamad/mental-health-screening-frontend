import { useCallback, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useResource from '../hooks/useResource';
import { studentService } from '../services/studentService';
import { PageHeader, Panel } from './PageSupport';
import { Form, Input, Table, Pager, ResourceState } from './LiveSupport';
export default function Students() {
  const { user } = useAuth(); const [search, setSearch] = useState(''); const [offset, setOffset] = useState(0); const [revision, setRevision] = useState(0);
  return <><PageHeader title="Students" description="Student records are stored by the backend. Students do not have accounts." /><Panel><Form submit="Search" onSave={async data => { setSearch(data.search.trim()); setOffset(0); }}><Input title="Search name or student code" name="search" required={false} maxLength={120} /></Form></Panel><StudentList key={`${search}:${offset}:${revision}`} search={search} offset={offset} onPage={setOffset} />{user.role === 'screening_personnel' && <Panel title="Register student"><StudentForm onDone={() => { setOffset(0); setRevision(v => v + 1); }} /></Panel>}</>;
}
export function StudentForm({ student, onDone }) {
  return <Form onSave={data => {
    const body = { name: data.name.trim(), age: Number(data.age), department: data.department.trim(), academic_year: data.academic_year.trim(), institution: data.institution.trim() };
    return student ? studentService.update(student.id, body) : studentService.create({ ...body, student_code: data.student_code.trim() });
  }} onDone={onDone}>{!student && <Input title="Student code" name="student_code" maxLength={50} />}<Input title="Full name" name="name" defaultValue={student?.name} maxLength={120} /><Input title="Age (years)" name="age" type="number" min={1} max={120} step={1} defaultValue={student?.age} /><Input title="Department" name="department" maxLength={120} defaultValue={student?.department} /><Input title="Academic year" name="academic_year" maxLength={32} defaultValue={student?.academic_year} /><Input title="Institution" name="institution" maxLength={120} defaultValue={student?.institution} /></Form>;
}
function StudentList({ search, offset, onPage }) {
  const load = useCallback(signal => studentService.list({ search, offset, limit: 20 }, { signal }), [search, offset]); const resource = useResource(load);
  return <ResourceState resource={resource}>{page => <Panel title="Student directory"><Table headers={['Student code', 'Name', 'Department', 'Academic year']} rows={page.items} render={row => <><td>{row.student_code}</td><td><a href={`#/students/details?id=${row.id}`}>{row.name}</a></td><td>{row.department}</td><td>{row.academic_year}</td></>} /><Pager page={page} offset={offset} onChange={onPage} /></Panel>}</ResourceState>;
}
