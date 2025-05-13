import "./tab_bar.css";

export default function TabBar() {
  return (
    <div>
      <div className="tabs">
        <button className="tab active">🏠 Home</button>
        <button className="tab">👤 Perfil</button>
        <button className="tab">⚙️ Config</button>
      </div>
    </div>
  );
}
