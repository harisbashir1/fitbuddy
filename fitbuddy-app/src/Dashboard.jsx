import { Link } from 'react-router-dom';

const Dashboard = () => {
  
    return (
      <div>
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/UserProfile">Profile</Link></li>
            </ul>
          </nav>
        </header>
      </div>
    );
    };
    
    export default Dashboard;