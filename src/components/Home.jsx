import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="section">
        <h1>🏓 Sistema de Gestión de Padel</h1>
        <p className="subtitle">Bienvenido al sistema de gestión de reservas y torneos de padel</p>
      </div>
      <div className="grid cols-3">
        <Link to="/reservas" className="nav-link">
          <div className="card hover">
            <h3 style={{ margin: 0 }}>📅 Reservas</h3>
            <p className="muted" style={{ marginTop: 8 }}>Gestiona tus reservas de canchas de padel</p>
          </div>
        </Link>
        <Link to="/mis-reservas" className="nav-link">
          <div className="card hover">
            <h3 style={{ margin: 0 }}>📋 Mis Reservas</h3>
            <p className="muted" style={{ marginTop: 8 }}>Ve y gestiona tus reservas existentes</p>
          </div>
        </Link>
        <Link to="/torneos" className="nav-link">
          <div className="card hover">
            <h3 style={{ margin: 0 }}>🏆 Torneos</h3>
            <p className="muted" style={{ marginTop: 8 }}>Participa en torneos y competiciones</p>
          </div>
        </Link>
        <Link to="/mis-torneos" className="nav-link">
          <div className="card hover">
            <h3 style={{ margin: 0 }}>🏅 Mis Torneos</h3>
            <p className="muted" style={{ marginTop: 8 }}>Ve los torneos en los que estás inscrito</p>
          </div>
        </Link>
        <Link to="/admin" className="nav-link">
          <div className="card hover">
            <h3 style={{ margin: 0 }}>⚙️ Panel Admin</h3>
            <p className="muted" style={{ marginTop: 8 }}>Gestiona usuarios, torneos y reservas</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
