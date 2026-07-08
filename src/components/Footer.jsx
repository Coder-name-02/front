export default function Footer() {
  return (
    <footer className="bg-white border-top py-3 px-4 text-center text-md-between d-md-flex align-items-center justify-content-between mt-auto">
      <p className="text-muted mb-0 small">
        &copy; {new Date().getFullYear()} StoreLogo Inc. All rights reserved.
      </p>
      <ul className="nav justify-content-center gap-3 mt-2 mt-md-0 small">
        <li><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
        <li><a href="#" className="text-decoration-none text-muted">Terms of Use</a></li>
        <li><a href="#" className="text-decoration-none text-muted">API Status</a></li>
      </ul>
    </footer>
  );
}