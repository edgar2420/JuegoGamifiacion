import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="vh-100 d-flex flex-column">
      <div className="flex-grow-1">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;