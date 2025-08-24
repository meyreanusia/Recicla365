import { Link, useNavigate } from "react-router-dom";

export default function MenuNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark border border-success">
      <div className="container">
        <Link className="navbar-brand" to="/"><img src="public/logo.png" alt="" width={'100px'} /></Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item me-3 menu-navegacao">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item menu-navegacao ">
              <Link className="nav-link " to="/locais">Locais</Link>
            </li>
          </ul>

          <button className="btn btn-outline-light bg-success" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
