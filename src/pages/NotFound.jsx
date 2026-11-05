import { PageHeader, Panel } from './PageSupport';
export default function NotFound() {
  return <><PageHeader title="Page not found" description="This address does not match a frontend page."/><Panel title="404"><p className="mb-5">Choose a page from navigation or return to the dashboard.</p><a className="primary-button inline-flex" href="#/dashboard">Back to dashboard</a></Panel></>;
}
